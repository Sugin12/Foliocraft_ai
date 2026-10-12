import React from "react";
import { StepInfo } from "../types";
import { Check, ClipboardList, GraduationCap, Star, Briefcase, Award, Share2, Palette, Eye } from "lucide-react";

interface SidebarStepsProps {
  steps: StepInfo[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completedSteps: number[];
}

export const SidebarSteps: React.FC<SidebarStepsProps> = ({
  steps,
  currentStep,
  setCurrentStep,
  completedSteps,
}) => {
  // There are exactly 7 setup steps to finalize before step 8 (publishing & pdf export)
  const completedCount = completedSteps.filter(id => id >= 1 && id <= 7).length;
  const percentageFloat = (completedCount / 7) * 100;
  
  const percentageText = `${Math.round(percentageFloat)}%`;

  const maxCompletedStep = completedSteps.length > 0 ? Math.max(...completedSteps) : 0;
  const maxUnlockedStep = maxCompletedStep + 1;

  const getIcon = (id: number, isActive: boolean) => {
    // We pass icon colors conditionally based on status
    const cls = `w-4 h-4 ${isActive ? "text-[#F4B400]" : "text-stone-500"}`;
    switch (id) {
      case 1: return <ClipboardList className={cls} />;
      case 2: return <GraduationCap className={cls} />;
      case 3: return <Star className={cls} />;
      case 4: return <Briefcase className={cls} />;
      case 5: return <Award className={cls} />;
      case 6: return <Share2 className={cls} />;
      case 7: return <Palette className={cls} />;
      case 8: return <Eye className={cls} />;
      default: return <ClipboardList className={cls} />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 space-y-4 w-full max-w-full overflow-hidden">
      {/* Top Header Row with dynamic progress info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-stone-100">
        <div>
          <h3 className="font-extrabold text-[#111827] text-sm flex items-center gap-2">
            <span className="p-1 px-2.5 bg-stone-900 text-[#F4B400] text-[9px] font-mono font-black rounded-lg uppercase tracking-wider">
              PATH TRACK
            </span>
            Creation Progress Timeline
          </h3>
          <p className="text-[10px] text-stone-500 font-semibold mt-0.5">
            Complete each section step-by-step to progress and print your portfolio
          </p>
        </div>
        
        {/* Progress percent trail */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-24 sm:w-32 bg-stone-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#F4B400] h-full transition-all duration-500 ease-out rounded-full" 
              style={{ width: `${completedCount === 7 ? 100 : percentageFloat}%` }}
            />
          </div>
          <span className="text-xs font-mono font-black text-[#F4B400] whitespace-nowrap">{percentageText} Complete</span>
        </div>
      </div>

      {/* Landscape Timeline Track Container (Horizontal Scrollable) */}
      <div className="overflow-x-auto scrollbar-none -mx-1 px-1 py-1.5 w-full max-w-full">
        <div className="flex items-center min-w-[780px] lg:min-w-0 justify-between relative">
          
          {steps.map((st, index) => {
            const isActive = currentStep === st.id;
            const isCompleted = completedSteps.includes(st.id);
            const isUnlocked = st.id <= maxUnlockedStep;
            const isLast = index === steps.length - 1;
            
            // Determine if the track connecting to the next node is active
            const isNextTrackActive = isCompleted || (st.id < currentStep && completedSteps.includes(st.id));

            return (
              <React.Fragment key={st.id}>
                {/* Step Node */}
                <button
                  id={`step-nav-btn-${st.id}`}
                  disabled={!isUnlocked}
                  onClick={() => {
                    if (isUnlocked) {
                      setCurrentStep(st.id);
                    }
                  }}
                  className={`flex flex-col items-center text-center transition-all duration-300 relative group focus:outline-none flex-1 min-w-[90px] max-w-[130px] ${
                    isUnlocked ? "cursor-pointer" : "cursor-not-allowed opacity-40"
                  }`}
                >
                  {/* Circle Disc */}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 relative z-10 ${
                    isActive 
                      ? "bg-amber-50 border-[#F4B400] ring-4 ring-amber-400/10 scale-105" 
                      : isCompleted
                        ? "bg-[#F4B400] border-[#F4B400] text-white"
                        : isUnlocked
                          ? "bg-white border-stone-200 text-stone-400 hover:border-stone-400 hover:text-stone-700"
                          : "bg-stone-50 border-stone-150 text-stone-300"
                  }`}>
                    {isCompleted ? (
                      <Check className="w-5 h-5 stroke-[3.5] text-white" />
                    ) : (
                      getIcon(st.id, isActive)
                    )}
                    
                    {/* Tiny badge with step ID */}
                    <span className={`absolute -top-1.5 -right-1.5 font-mono text-[8px] font-black w-4.5 h-4.5 rounded-full border flex items-center justify-center ${
                      isActive 
                        ? "bg-[#F4B455] border-white text-white shadow-xs" 
                        : isCompleted
                          ? "bg-white border-[#F4B400] text-stone-900"
                          : isUnlocked
                            ? "bg-stone-100 border-stone-200 text-stone-500"
                            : "bg-stone-50 border-stone-150 text-stone-350"
                    }`}>
                      {st.id}
                    </span>
                  </div>

                  {/* Step Labels */}
                  <div className="mt-2.5 px-0.5">
                    <span className={`block text-[9px] uppercase font-mono tracking-wider font-bold ${
                      isActive 
                        ? "text-[#F4B400]" 
                        : isUnlocked 
                          ? "text-stone-400" 
                          : "text-stone-300"
                    }`}>
                      {st.id === 8 ? "FINALIZE" : `STEP ${st.id}`}
                    </span>
                    <span className={`block text-[11px] font-black tracking-tight leading-tight truncate max-w-[100px] ${
                      isActive 
                        ? "text-[#111827]" 
                        : isCompleted 
                          ? "text-stone-700" 
                          : isUnlocked
                            ? "text-stone-400 group-hover:text-stone-700" 
                            : "text-stone-300"
                    }`}>
                      {st.name}
                    </span>
                  </div>
                </button>

                {/* Connector Track (Line) */}
                {!isLast && (
                  <div className="flex-grow h-1.5 mx-1 relative bg-stone-100 rounded-full overflow-hidden min-w-[15px] max-w-[50px] lg:max-w-none">
                    <div 
                      className="absolute inset-y-0 left-0 bg-[#F4B400] transition-all duration-300"
                      style={{ width: isNextTrackActive ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
          
        </div>
      </div>
    </div>
  );
};
