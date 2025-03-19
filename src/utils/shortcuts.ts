// types
type ShortcutConfig = {
    key: string;
    // add other options if needed
    // ctrlKey?: boolean;
    // metaKey?: boolean;
};

// definition of shortcuts
export const KEYBOARD_SHORTCUTS = {
    NEW_STRUCTURE: 'n',
    // add other shortcuts...
} as const;

// lowercase version for verification (private)
const BLOCKED_SHORTCUTS_LOWERCASE = [
    KEYBOARD_SHORTCUTS.NEW_STRUCTURE.toLowerCase(),
    // add other shortcuts...
] as const;

// private utility function
function shouldBlockShortcut(event: KeyboardEvent): boolean {
    return (
        BLOCKED_SHORTCUTS_LOWERCASE.includes(event.key.toLowerCase()) && 
        !event.ctrlKey && 
        !event.metaKey
    );
}

// public function to handle shortcuts in forms
export function registerFormShortcutBlocker(formElement: HTMLElement | null) {
    const preventShortcuts = (event: KeyboardEvent) => {
        if (shouldBlockShortcut(event)) {
            event.stopPropagation();
        }
    };

    formElement?.addEventListener('keydown', preventShortcuts);
    
    // return cleanup function
    return () => formElement?.removeEventListener('keydown', preventShortcuts);
}

// function to handle global shortcut registration
export function registerGlobalShortcut(
    id: string,
    config: ShortcutConfig,
    callback: () => void,
    registerFn: (id: string, config: ShortcutConfig, callback: () => void) => void,
    unregisterFn: (id: string) => void
) {
    registerFn(id, { key: config.key }, callback);
    return () => unregisterFn(id);
}