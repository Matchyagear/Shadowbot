import { Stock } from './types';

export interface IElectronAPI {
    saveSnapshot: (stocks: Stock[]) => Promise<{success: boolean, path?: string, error?: string}>;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
