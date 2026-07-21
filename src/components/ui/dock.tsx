"use client";

import React, { useRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import type { MotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import GlassSurface from "@/components/ui/glass-surface";

export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string;
  iconSize?: number;
  iconMagnification?: number;
  disableMagnification?: boolean;
  iconDistance?: number;
  direction?: "top" | "middle" | "bottom";
  children: React.ReactNode;
}

const DEFAULT_SIZE = 66;
const DEFAULT_MAGNIFICATION = 96;
const DEFAULT_DISTANCE = 150;

const dockVariants = cva("mx-auto flex w-max items-center justify-center");

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      children,
      iconSize = DEFAULT_SIZE,
      iconMagnification = DEFAULT_MAGNIFICATION,
      disableMagnification = false,
      iconDistance = DEFAULT_DISTANCE,
      direction = "middle",
      ...props
    },
    ref
  ) => {
    const mouseX = useMotionValue(Infinity);

    const renderChildren = () => {
      return React.Children.map(children, (child) => {
        if (
          React.isValidElement<DockIconProps>(child) &&
          child.type === DockIcon
        ) {
          return React.cloneElement(child, {
            ...child.props,
            mouseX: mouseX,
            size: iconSize,
            magnification: iconMagnification,
            disableMagnification: disableMagnification,
            distance: iconDistance,
          });
        }
        return child;
      });
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        {...props}
        className={cn(dockVariants({ className }), {
          "items-start": direction === "top",
          "items-center": direction === "middle",
          "items-end": direction === "bottom",
        })}
      >
        <GlassSurface
          width="auto"
          height={92}
          borderRadius={28}
          backgroundOpacity={0.15}
          brightness={95}
          blur={12}
          saturation={1.4}
          distortionScale={-120}
          greenOffset={8}
          blueOffset={16}
          className="px-3 py-2"
        >
          <div
            className={cn("flex items-center justify-center gap-4", {
              "items-start": direction === "top",
              "items-center": direction === "middle",
              "items-end": direction === "bottom",
            })}
          >
            {renderChildren()}
          </div>
        </GlassSurface>
      </motion.div>
    );
  }
);

Dock.displayName = "Dock";

export interface DockIconProps
  extends Omit<
    MotionProps & React.HTMLAttributes<HTMLDivElement>,
    "children"
  > {
  size?: number;
  magnification?: number;
  disableMagnification?: boolean;
  distance?: number;
  mouseX?: MotionValue<number>;
  className?: string;
  children?: React.ReactNode;
}

const DockIcon = ({
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  disableMagnification,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className,
  children,
  ...props
}: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const padding = Math.max(10, size * 0.15);
  const defaultMouseX = useMotionValue(Infinity);

  const distanceCalc = useTransform(
    mouseX ?? defaultMouseX,
    (val: number) => {
      const bounds = ref.current?.getBoundingClientRect() ?? {
        x: 0,
        width: 0,
      };
      return val - bounds.x - bounds.width / 2;
    }
  );

  const targetSize = disableMagnification ? size : magnification;

  const sizeTransform = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [size, targetSize, size]
  );

  const scaleSize = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 200,
    damping: 14,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width: scaleSize, height: scaleSize, padding }}
      className={cn(
        "flex aspect-square cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/40",
        className
      )}
      {...props}
    >
      <div>{children}</div>
    </motion.div>
  );
};

DockIcon.displayName = "DockIcon";

export { Dock, DockIcon, dockVariants };
