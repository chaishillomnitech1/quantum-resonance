import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Layers from "@/pages/Layers";
import Logic from "@/pages/Logic";
import Simulations from "@/pages/Simulations";
import ScrollVerseFooter from "@/components/scrollverse-footer";


function Router() {
  const base = window.location.pathname.startsWith("/quantum-resonance")
    ? "/quantum-resonance"
    : "";
  return (
    <WouterRouter base={base}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/layers" component={Layers} />
        <Route path="/logic" component={Logic} />
        <Route path="/simulations" component={Simulations} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <ScrollVerseFooter className="md:pl-64" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}


export default App;

