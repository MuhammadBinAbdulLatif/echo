import { Doc } from '@workspace/backend/convex/_generated/dataModel'
import {atomWithStorage} from 'jotai/utils'

export const STATUS_FILTER_KEY = 'echo-filter-key'
export const statusFilterAtom = atomWithStorage<Doc<'conversations'>['status'] | 'all'>(STATUS_FILTER_KEY, 'all')