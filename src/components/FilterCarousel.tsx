"use client";

import { memo, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";

type Props = {
  value?: string | null;
  data: { value: string; label: string }[];
  isLoading?: boolean;
  onSelect: (value: string | null) => void;
};

export const FilterCarousel = memo(function FilterCarousel({
  isLoading,
  data,
  value,
  onSelect,
}: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [count, setCount] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  function onSelectValue(value: string | null) {
    onSelect(value);
  }

  return (
    <div className="w-full relative">
      {/* Left fade */}
      <div
        className={cn(
          "absolute left-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none",
          current === 1 ? "hidden" : null
        )}
      />

      <Carousel
        setApi={setApi}
        className="w-full px-12"
        opts={{ align: "start", dragFree: true }}
      >
        <CarouselContent className="-ml-3">
          {!isLoading ? (
            <CarouselItem className="pl-3 basis-auto">
              <Badge
                variant={!value ? "default" : "secondary"}
                className="rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm"
                onClick={() => onSelectValue(null)}
              >
                <span className="select-none">All</span>
              </Badge>
            </CarouselItem>
          ) : null}

          {isLoading
            ? Array.from({ length: 14 }).map((_, index) => (
                <CarouselItem key={index} className="pl-3 basis-auto">
                  <Skeleton className="w-[100px] h-full rounded-lg px-3 py-1 text-sm font-semibold">
                    &nbsp;
                  </Skeleton>
                </CarouselItem>
              ))
            : null}

          {!isLoading &&
            data?.map((item) => (
              <CarouselItem key={item.value} className="pl-3 basis-auto">
                <Badge
                  variant={item.value === value ? "default" : "secondary"}
                  className="rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm"
                  onClick={() => onSelectValue(item.value)}
                >
                  <span className="select-none">{item.label}</span>
                </Badge>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-1 z-20" />
        <CarouselNext className="absolute right-1 z-20" />
      </Carousel>
      {/* Right fade */}
      <div
        className={cn(
          "absolute right-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none",
          current === count ? "hidden" : null
        )}
      />
    </div>
  );
});
