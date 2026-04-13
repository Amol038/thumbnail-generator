import { RectangleHorizontal, RectangleVertical, Square } from "lucide-react"
import { aspectRatios } from "../assets/assets";
import type { AspectRatio } from "../assets/assets";

// 1. Fixed 'onchange' to 'onChange' to match destructuring
// 2. Updated the type to expect (ratio: AspectRatio) => void
const AspectRatioSelector = ({ value, onChange }: { 
    value: AspectRatio; 
    onChange: (ratio: AspectRatio) => void 
}) => {
    
    const iconMap: Record<AspectRatio, React.ReactNode> = {
        '16:9': <RectangleHorizontal className="size-4" />,
        '1:1': <Square className="size-4" />,
        '9:16': <RectangleVertical className="size-4" />
    }

    return (
        <div className="space-y-3 dark">
            <label className="block text-sm font-medium text-zinc-200">Aspect Ratio</label>
            <div className="flex flex-wrap gap-2">
                {aspectRatios.map((ratio) => {
                    const selected = value === ratio;

                    return (
                        <button 
                            key={ratio} 
                            type="button" 
                            // Now matches the type definition above
                            onClick={() => onChange(ratio)}
                            className={`flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm transition border-white/10 ${
                                selected 
                                    ? 'bg-white/10 border-white/20' 
                                    : 'hover:bg-white/6 border-transparent'
                            }`}
                        >
                            {iconMap[ratio]}
                            <span className="tracking-widest">{ratio}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default AspectRatioSelector;