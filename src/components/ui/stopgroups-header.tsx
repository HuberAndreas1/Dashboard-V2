"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Layers, Eye, Save, X } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile.ts"

interface AppHeaderProps {
    onCollapseAll: () => void
    showPrivateGroups: boolean
    onTogglePrivateGroups: (checked: boolean) => void
}

export function StopGroupHeader({ onCollapseAll, showPrivateGroups, onTogglePrivateGroups }: AppHeaderProps) {
    const isMobile = useIsMobile()

    return (
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <div className={`flex flex-wrap items-center gap-3 ${isMobile ? "justify-center" : ""}`}>
                {/* Primary Actions */}
                <div className="flex flex-wrap gap-2">
                    <Button className="bg-brand-600 hover:bg-brand-700 text-white shadow-sm">
                        <Plus className="w-4 h-4 mr-2" />
                        {!isMobile && "Add StopGroup"}
                    </Button>
                    <Button className="bg-brand-600 hover:bg-brand-700 text-white shadow-sm">
                        <Plus className="w-4 h-4 mr-2" />
                        {!isMobile && "Add Stop"}
                    </Button>
                    <Button onClick={onCollapseAll} variant="outline" className="shadow-sm">
                        <Layers className="w-4 h-4 mr-2" />
                        {!isMobile && "Collapse All"}
                    </Button>
                </div>

                {/* Settings */}
                <div className="flex items-center space-x-2 px-3 py-2 bg-surface-50 rounded-lg">
                    <Checkbox
                        id="private-groups"
                        checked={showPrivateGroups}
                        onCheckedChange={onTogglePrivateGroups}
                        className="data-[state=checked]:bg-brand-600 data-[state=checked]:border-brand-600"
                    />
                    <label htmlFor="private-groups" className="text-sm font-medium cursor-pointer">
                        <Eye className="w-4 h-4 inline mr-1" />
                        {!isMobile && "Show Private Groups"}
                    </label>
                </div>

                {/* Save Actions */}
                <div className={`flex gap-2 ${isMobile ? "w-full justify-center" : "ml-auto"}`}>
                    <Button className="bg-accent-600 hover:bg-accent-700 text-white shadow-sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                    <Button variant="outline" className="shadow-sm">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    )
}
