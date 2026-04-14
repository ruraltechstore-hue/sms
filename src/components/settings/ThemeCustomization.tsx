import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Palette, Sun, Moon, Monitor, Save, Check } from "lucide-react";
import { useTheme } from "next-themes";

const COLOR_PRESETS = [
  { name: "Default Blue", primary: "221.2 83.2% 53.3%", accent: "210 40% 96%" },
  { name: "Emerald", primary: "160 84% 39%", accent: "160 40% 96%" },
  { name: "Violet", primary: "263 70% 50%", accent: "263 40% 96%" },
  { name: "Rose", primary: "346 77% 50%", accent: "346 40% 96%" },
  { name: "Amber", primary: "38 92% 50%", accent: "38 40% 96%" },
  { name: "Slate", primary: "215 16% 47%", accent: "215 16% 96%" },
];

export function ThemeCustomization() {
  const { theme, setTheme } = useTheme();
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [fontSize, setFontSize] = useState("default");

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Palette className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold">Theme Mode</h3>
            <p className="text-xs text-muted-foreground">Choose light, dark, or system preference</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isActive = theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`rounded-xl border p-4 text-center transition-all ${isActive ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:bg-secondary/50"}`}
              >
                <Icon className={`h-6 w-6 mx-auto mb-2 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <p className={`text-sm font-medium ${isActive ? "text-primary" : ""}`}>{opt.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Color Preset</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {COLOR_PRESETS.map((preset, i) => (
            <button
              key={preset.name}
              onClick={() => setSelectedPreset(i)}
              className={`rounded-xl border p-3 flex items-center gap-3 transition-all ${selectedPreset === i ? "border-primary ring-2 ring-primary/20" : "hover:bg-secondary/50"}`}
            >
              <div
                className="h-8 w-8 rounded-full shrink-0 border"
                style={{ backgroundColor: `hsl(${preset.primary})` }}
              />
              <span className="text-sm font-medium">{preset.name}</span>
              {selectedPreset === i && <Check className="h-4 w-4 text-primary ml-auto" />}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Display Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Compact Mode</p>
              <p className="text-xs text-muted-foreground">Reduce padding and spacing for denser layouts</p>
            </div>
            <Switch checked={compactMode} onCheckedChange={setCompactMode} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Animations</p>
              <p className="text-xs text-muted-foreground">Enable page and component transitions</p>
            </div>
            <Switch checked={animations} onCheckedChange={setAnimations} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Font Size</p>
              <p className="text-xs text-muted-foreground">Adjust the base text size</p>
            </div>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => toast.success("Appearance settings saved!")} className="gap-2">
          <Save className="h-4 w-4" />Save Preferences
        </Button>
      </div>
    </motion.div>
  );
}
