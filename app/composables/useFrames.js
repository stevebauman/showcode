import { cloneDeep } from 'lodash';
import frames, { FRAME_NONE } from '~/data/frames';

export default function () {
    function findFrame(id) {
        return frames.find((frame) => frame.id === id) ?? frames[0];
    }

    function applyFrame(settings, id) {
        const frame = findFrame(id);
        const headerSettings = {
            showHeader: settings.showHeader,
            showTitle: settings.showTitle,
            showMenu: settings.showMenu,
            showColorMenu: settings.showColorMenu,
            showHeaderAccent: settings.showHeaderAccent,
        };

        Object.assign(settings, cloneDeep(frame.settings));
        Object.assign(settings, headerSettings);
    }

    return {
        frames,
        findFrame,
        applyFrame,
        FRAME_NONE,
    };
}
