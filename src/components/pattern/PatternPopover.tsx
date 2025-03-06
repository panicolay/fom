import { Popover, PopoverButton, PopoverPanel, PopoverBackdrop } from "@headlessui/react";
import { TextField } from "../form/TextField";
import { Button } from "../buttons/Button";
import { useState } from "react";
import { PatternFormData } from "../../types/patternTypes";

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
            <PopoverButton className="text-neutral-400 relative z-20">blabla</PopoverButton>
            <PopoverPanel transition anchor="bottom start" className="absolute top-0 left-0 w-80 [--anchor-gap:8px]
                bg-neutral-900 border border-neutral-500 z-30
                transition duration-160 ease-out data-[closed]:opacity-0">
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
                    <Button variant="secondary" type="submit">Confirm</Button>
                </form>
            </PopoverPanel>
        </Popover>
  )
}