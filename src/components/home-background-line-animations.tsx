import { animate } from "framer-motion/dom";
import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { HOME_BACKGROUND_ANIMATION } from "../lib/home-background-animation";

const REVEAL_STROKE_WIDTH = 220;

const { lineGrowDurationMs, lineStaggerMs } = HOME_BACKGROUND_ANIMATION;

export type LineRevealSetup = {
	mask: SVGMaskElement;
	d: string;
	length: number;
	index: number;
};

type HomeBackgroundLineAnimationsProps = {
	reveals: LineRevealSetup[];
	shouldAnimate: boolean;
	reducedMotion: boolean;
};

function LineRevealPath({
	d,
	length: estimatedLength,
	index,
	shouldAnimate,
	reducedMotion,
}: {
	d: string;
	length: number;
	index: number;
	shouldAnimate: boolean;
	reducedMotion: boolean;
}) {
	const pathRef = useRef<SVGPathElement>(null);

	useLayoutEffect(() => {
		const path = pathRef.current;
		if (!path) return;

		const measured = path.getTotalLength();
		const length = measured > 0 ? measured : estimatedLength;
		const hidden = `0 ${length}`;
		const shown = `${length} ${length}`;

		path.style.strokeDasharray = hidden;

		if (reducedMotion) {
			path.style.strokeDasharray = shown;
			return;
		}

		if (!shouldAnimate) return;

		const controls = animate(
			path,
			{ strokeDasharray: [hidden, shown] },
			{
				duration: lineGrowDurationMs / 1000,
				delay: (index * lineStaggerMs) / 1000,
				ease: [0.22, 1, 0.36, 1],
			},
		);

		return () => controls.stop();
	}, [estimatedLength, index, shouldAnimate, reducedMotion]);

	return (
		<path
			ref={pathRef}
			d={d}
			fill="none"
			stroke="white"
			strokeWidth={REVEAL_STROKE_WIDTH}
			strokeLinecap="butt"
			strokeLinejoin="round"
			style={{ strokeDasharray: `0 ${estimatedLength}` }}
		/>
	);
}

export function HomeBackgroundLineAnimations({
	reveals,
	shouldAnimate,
	reducedMotion,
}: HomeBackgroundLineAnimationsProps) {
	if (!reveals.length || (!shouldAnimate && !reducedMotion)) return null;

	return (
		<>
			{reveals.map(({ mask, d, length, index }) =>
				createPortal(
					<LineRevealPath
						key={index}
						d={d}
						length={length}
						index={index}
						shouldAnimate={shouldAnimate}
						reducedMotion={reducedMotion}
					/>,
					mask,
				),
			)}
		</>
	);
}
