import { RoutineBoard } from "@/components/routines/RoutineBoard";

export default function RoutinesPage() {
  return (
    <div className="flex-1 w-full p-4 lg:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <RoutineBoard />
      </div>
    </div>
  );
}