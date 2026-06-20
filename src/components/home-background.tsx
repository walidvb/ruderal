import {
	type CSSProperties,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

import bgSvg from "../assets/bg.svg?raw";
import {
	getHomePlant,
	HOME_PLANTS,
	type HomePlant,
	type HomePlantId,
	type HomePlantPosition,
} from "../data/home-plants";
import { HOME_BACKGROUND_ANIMATION } from "../lib/home-background-animation";
import { buildLineRevealPath } from "../lib/home-background-lines";
import {
	HomeBackgroundLineAnimations,
	type LineRevealSetup,
} from "./home-background-line-animations";
import { getHomePlantContent } from "./home-plant-content";
import { HomePlantDrawer } from "./home-plant-drawer";
import { AnimatedLines } from "./v0-bg-lines-animation";

const ORIGIN = { x: 828, y: 538 };
const VIEWBOX = { width: 1728, height: 1098 };
const PLANT_GROUP_IDS = ["about", "happenings", "podcast", "study-group"];

const { plantGrowDurationMs, plantDelaysMs } = HOME_BACKGROUND_ANIMATION;

function getDefs(svg: SVGSVGElement) {
	let defs = svg.querySelector("defs");
  if (!defs) {
		defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
		svg.prepend(defs);
  }
	return defs;
}

function waitForSvgImages(svg: SVGSVGElement) {
	const images = [...svg.querySelectorAll("image")];

  return Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          const href =
						image.getAttribute("href") ??
						image.getAttribute("xlink:href") ??
						"";

					if (href.startsWith("data:")) {
						resolve();
						return;
          }

					image.addEventListener("load", () => resolve(), { once: true });
					image.addEventListener("error", () => resolve(), { once: true });
        }),
    ),
	);
}

async function waitUntilPageReady(svg: SVGSVGElement) {
	if (document.readyState !== "complete") {
    await new Promise<void>((resolve) => {
			window.addEventListener("load", () => resolve(), { once: true });
		});
  }

	await waitForSvgImages(svg);
  await new Promise<void>((resolve) => {
		requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
	});
}

function applyAnimationVars(stage: HTMLElement) {
	stage.style.setProperty(
		"--home-plant-grow-duration",
		`${plantGrowDurationMs}ms`,
	);
}

function removeSvgPlants(svg: SVGSVGElement) {
	for (const id of PLANT_GROUP_IDS) {
		svg.querySelector(`#${CSS.escape(id)}`)?.remove();
    }
  }

function prepareLineMasks(svg: SVGSVGElement) {
	const defs = getDefs(svg);
	const paths = [...svg.querySelectorAll<SVGPathElement>("#lines path")];
	const reveals: LineRevealSetup[] = [];

	paths.forEach((path, index) => {
		const reveal = buildLineRevealPath(path, ORIGIN);
		if (!reveal) return;

		const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
		wrapper.classList.add("home-bg-line");
		path.parentNode?.insertBefore(wrapper, path);
		wrapper.appendChild(path);

		const maskId = `home-bg-line-mask-${index + 1}`;
		const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
		mask.id = maskId;
		mask.setAttribute("maskUnits", "userSpaceOnUse");
		mask.setAttribute("x", "0");
		mask.setAttribute("y", "0");
		mask.setAttribute("width", String(VIEWBOX.width));
		mask.setAttribute("height", String(VIEWBOX.height));

		const maskBg = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"rect",
		);
		maskBg.setAttribute("width", String(VIEWBOX.width));
		maskBg.setAttribute("height", String(VIEWBOX.height));
		maskBg.setAttribute("fill", "black");
		mask.appendChild(maskBg);

		defs.appendChild(mask);
		wrapper.setAttribute("mask", `url(#${maskId})`);

		reveals.push({ mask, d: reveal.d, length: reveal.length, index });
	});

	return reveals;
    }

function plantPositionVars(position: HomePlantPosition) {
	return {
		"--plant-top": `${position.top}%`,
		"--plant-left": `${position.left}%`,
		"--label-top": `${position.labelTop}%`,
		"--label-left": `${position.labelLeft}%`,
	} as CSSProperties;
    }

type HomeBgPlantProps = {
	plant: HomePlant;
	shouldAnimate: boolean;
	reducedMotion: boolean;
	onClick: (id: HomePlantId) => void;
};

function HomeBgPlant({
	plant,
	shouldAnimate,
	reducedMotion,
	onClick,
}: HomeBgPlantProps) {
	const shown = reducedMotion || shouldAnimate;

	return (
		<div
			className={[
				"home-bg-plant",
				shown && "home-bg-plant--shown",
				shouldAnimate && "home-bg-plant--animate",
			]
				.filter(Boolean)
				.join(" ")}
			style={
      {
					...plantPositionVars(plant.positionMobile),
					"--plant-top-desktop": `${plant.positionDesktop.top}%`,
					"--plant-left-desktop": `${plant.positionDesktop.left}%`,
					"--label-top-desktop": `${plant.positionDesktop.labelTop}%`,
					"--label-left-desktop": `${plant.positionDesktop.labelLeft}%`,
					"--home-plant-delay": `${plantDelaysMs[plant.id]}ms`,
				} as CSSProperties
  }
		>
			<button
				type="button"
				className="home-bg-plant-btn"
				aria-label={plant.title}
				onClick={() => onClick(plant.id)}
			>
				<img
					className="home-bg-plant-image"
					src={plant.imageSrc}
					alt=""
					draggable={false}
				/>
			</button>
			<span className="home-bg-plant-label">{plant.title}</span>
		</div>
	);
}

export function HomeBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [selectedPlant, setSelectedPlant] = useState<HomePlant | null>(null)

  const handlePlantClick = useCallback((id: HomePlantId) => {
    const plant = getHomePlant(id)
    if (!plant) return

    setSelectedPlant(plant)
  }, [])

  const handleDrawerOpenChange = useCallback((open: boolean) => {
    if (!open) setSelectedPlant(null)
  }, [])

  return (
    <>
			<div>
				<div  className="home-bg-stage">
					<div className="home-bg-svg-host" />
          {/* <AnimatedLines /> */}
          <img src="/assets/bg.svg" />
					<div className="home-bg-plants">
						{HOME_PLANTS.map((plant) => (
              <HomeBgPlant
                key={plant.id}
                plant={plant}
                shouldAnimate={true}

                onClick={handlePlantClick}
              />
            ))}
					</div>
        </div>
      </div>
      <HomePlantDrawer
        plant={selectedPlant}
        customContent={
          selectedPlant ? getHomePlantContent(selectedPlant.id) : null
        }
        onOpenChange={handleDrawerOpenChange}
        onMenuClick={handlePlantClick}
        selectedMenu={selectedPlant}
      />
    </>
	);
}
