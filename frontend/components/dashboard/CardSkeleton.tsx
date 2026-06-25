import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const CardSkeleton = () => {

    return (
        <SkeletonTheme baseColor="#202020" highlightColor="#444">
            <Skeleton className="flex flex-1 w-full h-full z-10" />
        </SkeletonTheme>
    )
}