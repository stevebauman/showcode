export default function () {
    return globalThis.window?.electronIpc ?? null;
}
