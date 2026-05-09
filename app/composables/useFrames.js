import { cloneDeep } from 'lodash';
import frames, { FRAME_NONE } from '~/data/frames';

export default function () {
    function findFrame(id) {
        return frames.find((frame) => frame.id === id) ?? frames[0];
    }

    function applyFrame(settings, id) {
        const frame = findFrame(id);

        Object.assign(settings, cloneDeep(frame.settings));
    }

    return {
        frames,
        findFrame,
        applyFrame,
        FRAME_NONE,
    };
}
