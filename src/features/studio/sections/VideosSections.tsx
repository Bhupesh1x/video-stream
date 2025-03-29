"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { VideoThumbnail } from "@/features/videos/components/VideoThumbnail";

function VideosSectionSuspence() {
  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <div>
      <Table className="border-y">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[410px] pl-6">Video</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Views</TableHead>
            <TableHead className="text-right">Comments</TableHead>
            <TableHead className="text-right pr-6">Likes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos?.pages
            ?.flatMap((value) => value.items)
            ?.map((video) => (
              <Link
                href={`/studio/video/${video.id}`}
                key={video.id}
                legacyBehavior
              >
                <TableRow className="cursor-pointer">
                  <TableCell>
                    <div className="w-36 shrink-0">
                      <VideoThumbnail
                        title={video.title}
                        previewUrl={video.previewUrl}
                        thumbnailImageUrl={video.thumbnailUrl}
                        duration={video.duration || 0}
                      />
                    </div>
                  </TableCell>
                  <TableCell>visibility</TableCell>
                  <TableCell>status</TableCell>
                  <TableCell>date</TableCell>
                  <TableCell>views</TableCell>
                  <TableCell>comments</TableCell>
                  <TableCell>likes</TableCell>
                </TableRow>
              </Link>
            ))}
        </TableBody>
      </Table>
      <InfiniteScroll
        isManual
        fetchNextPage={query.fetchNextPage}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </div>
  );
}

export function VideosSection() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <VideosSectionSuspence />
      </ErrorBoundary>
    </Suspense>
  );
}
