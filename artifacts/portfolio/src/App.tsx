import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Journey from "@/pages/Journey";
import Interviews from "@/pages/Interviews";
import Personas from "@/pages/Personas";
import JourneyMaps from "@/pages/JourneyMaps";
import Surveys from "@/pages/Surveys";
import Ideation from "@/pages/Ideation";
import Solution from "@/pages/Solution";
import Team from "@/pages/Team";
import Resources from "@/pages/Resources";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/journey" component={Journey} />
          <Route path="/interviews" component={Interviews} />
          <Route path="/personas" component={Personas} />
          <Route path="/journey-maps" component={JourneyMaps} />
          <Route path="/surveys" component={Surveys} />
          <Route path="/ideation" component={Ideation} />
          <Route path="/solution" component={Solution} />
          <Route path="/team" component={Team} />
          <Route path="/resources" component={Resources} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <footer className="border-t border-border bg-card px-8 py-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Prototype Squad</span>
          <span>Built to understand. Designed to help.</span>
          <span>Design Thinking · 2025–26</span>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
