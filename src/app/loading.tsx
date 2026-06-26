import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-24">
      <section className="container mx-auto px-6 py-12">
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-14 w-44 rounded-full mt-6" />
        </div>
      </section>

      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
          <Skeleton className="md:col-span-2 rounded-3xl" />
          <Skeleton className="rounded-3xl" />
          <Skeleton className="rounded-3xl" />
        </div>
      </section>

      <section className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-4">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Skeleton key={idx} className="h-80 rounded-3xl" />
          ))}
        </div>
      </section>
    </div>
  );
}
