import { useState } from "react";
import Layout from "@/components/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Plus, Trash2, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  date: Date;
  time: string;
  done: boolean;
}

const TimeManager = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newTime, setNewTime] = useState("09:00");

  const addTask = () => {
    if (!newTask.trim() || !selectedDate) return;
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: newTask, date: selectedDate, time: newTime, done: false },
    ]);
    setNewTask("");
  };

  const toggleTask = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const deleteTask = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const tasksForDate = tasks
    .filter((t) => selectedDate && format(t.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd"))
    .sort((a, b) => a.time.localeCompare(b.time));

  const datesWithTasks = [...new Set(tasks.map((t) => format(t.date, "yyyy-MM-dd")))];

  return (
    <Layout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground flex items-center gap-2">
            <CalendarIcon className="h-8 w-8 text-primary" /> Time Management
          </h1>
          <p className="text-muted-foreground">
            Plan your days and stay on top of deadlines.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
          {/* Calendar */}
          <div className="rounded-2xl border bg-card p-2 shadow-card self-start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => d && setSelectedDate(d)}
              className={cn("p-3 pointer-events-auto")}
              modifiers={{ hasTasks: (date) => datesWithTasks.includes(format(date, "yyyy-MM-dd")) }}
              modifiersClassNames={{ hasTasks: "bg-primary/15 font-bold" }}
            />
          </div>

          {/* Tasks panel */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              {selectedDate ? format(selectedDate, "EEEE, MMMM d") : "Select a date"}
            </h2>

            {/* Add task */}
            <div className="flex gap-2">
              <Input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-28 rounded-xl bg-card"
              />
              <Input
                placeholder="Add a task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                className="flex-1 rounded-xl bg-card"
              />
              <Button onClick={addTask} disabled={!newTask.trim()} className="gradient-calm rounded-xl text-primary-foreground border-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Task list */}
            {tasksForDate.length === 0 ? (
              <div className="rounded-2xl border bg-card p-8 text-center shadow-card">
                <p className="text-muted-foreground">No tasks for this day. Add one above!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tasksForDate.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border bg-card p-3 shadow-card transition-all",
                      task.done && "opacity-50"
                    )}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                        task.done ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                      )}
                    >
                      {task.done && "✓"}
                    </button>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {task.time}
                    </span>
                    <span className={cn("flex-1 text-sm text-foreground", task.done && "line-through")}>
                      {task.title}
                    </span>
                    <button onClick={() => deleteTask(task.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TimeManager;
