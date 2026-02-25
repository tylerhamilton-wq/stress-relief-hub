import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, Mail, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const emailTemplates = [
  "Ask professor for deadline extension",
  "Request a letter of recommendation",
  "Follow up on internship application",
  "Email group members about project meeting",
  "Request office hours appointment",
];

const generateEmail = (prompt: string): string => {
  const lower = prompt.toLowerCase();

  if (lower.includes("extension") || lower.includes("deadline")) {
    return `Subject: Request for Deadline Extension - [Course Name]\n\nDear Professor [Last Name],\n\nI hope this email finds you well. I am writing to respectfully request a brief extension on the [assignment name] that is currently due on [date].\n\nDue to [brief reason - e.g., unexpected circumstances, overlapping deadlines], I am finding it challenging to complete the assignment to the standard I hold myself to. I want to ensure I submit quality work that reflects my understanding of the material.\n\nWould it be possible to receive an extension of [number] days? I am committed to submitting the work by [proposed new date] at the latest.\n\nThank you for your understanding and consideration. I appreciate your support throughout this course.\n\nBest regards,\n[Your Name]\n[Student ID]\n[Course Name & Section]`;
  }

  if (lower.includes("recommendation") || lower.includes("letter")) {
    return `Subject: Request for Letter of Recommendation\n\nDear Professor [Last Name],\n\nI hope you are doing well. I am reaching out to ask if you would be willing to write a letter of recommendation on my behalf for [purpose - graduate school / scholarship / job application].\n\nI truly valued my experience in your [course name] class during [semester/year], where I [mention a specific project, achievement, or discussion]. Your mentorship has been instrumental in shaping my academic interests in [field].\n\nThe deadline for submission is [date], and I would be happy to provide any additional materials such as my resume, personal statement, or a summary of our work together.\n\nI completely understand if your schedule does not permit this, and I appreciate you considering my request.\n\nWarm regards,\n[Your Name]\n[Student ID]\n[Email/Phone]`;
  }

  if (lower.includes("internship") || lower.includes("follow up") || lower.includes("application")) {
    return `Subject: Following Up on [Position] Application\n\nDear [Hiring Manager's Name / Recruiting Team],\n\nI hope this message finds you well. I recently applied for the [Position Title] internship on [date of application] and wanted to follow up to express my continued interest in the opportunity.\n\nI am particularly excited about [specific aspect of the company or role], and I believe my experience in [relevant skill or experience] would allow me to contribute meaningfully to your team.\n\nI would welcome the opportunity to discuss how my background aligns with your needs. Please let me know if there is any additional information I can provide.\n\nThank you for your time and consideration.\n\nBest regards,\n[Your Name]\n[Phone Number]\n[LinkedIn Profile (optional)]`;
  }

  if (lower.includes("group") || lower.includes("meeting") || lower.includes("project")) {
    return `Subject: Project Meeting - Let's Schedule a Time\n\nHi everyone,\n\nI hope you're all doing well! I wanted to reach out about scheduling our next group meeting for the [project/assignment name].\n\nHere are a few time slots that work for me:\n• [Day, Date] at [Time]\n• [Day, Date] at [Time]\n• [Day, Date] at [Time]\n\nPlease reply with your availability so we can find a time that works for everyone. I suggest we meet at [location / Zoom link] and plan for about [duration].\n\nBefore we meet, it would be great if everyone could [brief prep task, e.g., review the project outline, complete their section draft].\n\nLooking forward to working together!\n\nBest,\n[Your Name]`;
  }

  return `Subject: [Clear, Specific Subject Line]\n\nDear [Recipient's Name],\n\nI hope this email finds you well. I am writing to you regarding ${prompt.slice(0, 80)}.\n\n[Provide context about your request or message here. Be specific about what you need and why.]\n\nI would appreciate your guidance on this matter. Please let me know if you need any additional information from my end.\n\nThank you for your time and consideration.\n\nBest regards,\n[Your Name]\n[Your Contact Information]`;
};

const EmailWriter = () => {
  const [prompt, setPrompt] = useState("");
  const [email, setEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    // Simulate AI thinking
    await new Promise((r) => setTimeout(r, 1200));
    setEmail(generateEmail(prompt));
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground flex items-center gap-2">
            <Mail className="h-8 w-8 text-primary" /> AI Email Writer
          </h1>
          <p className="text-muted-foreground">
            Describe the email you need and we'll draft it for you instantly.
          </p>
        </div>

        {/* Quick prompts */}
        <div className="flex flex-wrap gap-2">
          {emailTemplates.map((t) => (
            <button
              key={t}
              onClick={() => setPrompt(t)}
              className="rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {t}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="space-y-3">
          <Textarea
            placeholder="Describe the email you want to write... e.g., 'Ask my professor for a deadline extension on my research paper'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] resize-none rounded-xl border-2 bg-card text-foreground transition-colors focus:border-primary"
          />
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="gradient-calm rounded-xl px-6 text-primary-foreground border-0"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-pulse-soft" /> Generating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Generate Email
              </span>
            )}
          </Button>
        </div>

        {/* Output */}
        {email && (
          <div className="animate-slide-up space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Your Email</h2>
              <Button variant="outline" size="sm" onClick={handleCopy} className="rounded-lg">
                {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className="rounded-xl border-2 bg-card p-6 shadow-card">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                {email}
              </pre>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmailWriter;
