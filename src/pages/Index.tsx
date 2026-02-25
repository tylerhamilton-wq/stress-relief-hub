import { Link } from "react-router-dom";
import { Mail, Heart, Gamepad2, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";

const features = [
  {
    to: "/email-writer",
    icon: Mail,
    title: "AI Email Writer",
    description: "Craft professional emails in seconds with AI assistance. Just describe what you need!",
    color: "gradient-calm",
  },
  {
    to: "/stress-coping",
    icon: Heart,
    title: "Coping with Stress",
    description: "Discover proven strategies and techniques to manage student stress effectively.",
    color: "gradient-warm",
  },
  {
    to: "/games",
    icon: Gamepad2,
    title: "Stress Relief Games",
    description: "Take a break with fun, calming mini-games designed to help you relax and refocus.",
    color: "gradient-calm",
  },
];

const Index = () => {
  return (
    <Layout>
      <div className="animate-fade-in space-y-12">
        {/* Hero */}
        <div className="rounded-2xl gradient-hero p-8 text-center sm:p-12">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Your Wellness Companion 🌿
          </h1>
          <p className="mx-auto max-w-lg text-lg text-muted-foreground">
            Tools to help you write better emails, manage stress, and take mindful breaks — all in one place.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f, i) => (
            <Link
              key={f.to}
              to={f.to}
              className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`mb-4 inline-flex rounded-xl ${f.color} p-3`}>
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-foreground">{f.title}</h2>
              <p className="mb-4 text-sm text-muted-foreground">{f.description}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-transform group-hover:translate-x-1">
                Get started <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
