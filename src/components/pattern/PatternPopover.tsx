import { Popover, PopoverButton, PopoverPanel, PopoverBackdrop } from "@headlessui/react";
import { TextField } from "../form/TextField";
import { Button } from "../buttons/Button";
import { useState } from "react";
import { PatternFormData } from "../../types/patternTypes";
import { Plus } from "lucide-react";
import { PanelButton } from "../buttons/PanelButton";

export const PatternPopover = () => {

    const [formData, setFormData] = useState<PatternFormData>({
        start: 0,
        length: 1,
        repeat: 1,
        name: undefined,
        comment: undefined
    })

    return (
        <Popover>
            <PopoverBackdrop transition className="fixed inset-0 bg-neutral-950/40 z-10
                transition duration-160 ease-out data-[closed]:opacity-0" />
            <PopoverButton as={Button} variant="ghost"  className="relative z-20" icon={Plus} size="small" />
            <PopoverPanel transition anchor="bottom start" className="p-px w-80 [--anchor-gap:8px]
                bg-neutral-500 z-30
                transition duration-160 ease-out data-[closed]:scale-96 data-[closed]:opacity-0">
                <form className="flex flex-col w-full">
                    <div className="flex w-full
                        divide-neutral-500 divide-x">
                        <TextField variant="popover" label="start" id="start" 
                            value={formData.start.toString()} 
                            className="flex-1 min-w-0" 
                            onChange={(value) => setFormData({ ...formData, start: Number(value) })} 
                            type="number" required />
                        {/* <TextField variant="popover" label="end" id="end" 
                            value={formData.end?.toString() || ""} 
                            className="flex-1 min-w-0" 
                            onChange={(value) => setFormData({ ...formData, end: Number(value) })} 
                            type="number" required /> */}
                        <TextField variant="popover" label="length" id="length" 
                            value={formData.length.toString()} 
                            className="flex-1 min-w-0" 
                            onChange={(value) => setFormData({ ...formData, length: Number(value) })} 
                            type="number" required />
                        <TextField variant="popover" label="reps." id="reps" 
                            value={formData.repeat.toString()} 
                            className="flex-1 min-w-0" 
                            onChange={(value) => setFormData({ ...formData, repeat: Number(value) })} 
                            type="number" required />
                    </div>
                    <TextField variant="popover" label="comment" id="comment" 
                        value={formData.comment || ""} 
                        onChange={(value) => setFormData({ ...formData, comment: value as string })} 
                        type="text" required={false} />
                    <PanelButton label="confirm" variant="primary" type="submit"
                        className="!h-12"
                    >Confirm</PanelButton>
                </form>
            </PopoverPanel>
        </Popover>
  )
}