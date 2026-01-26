import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(function (_a) {
    var command = _a.command;
    return ({
        base: '/BBMAP/',
        plugins: [react()],
        
        server: {
            open: true,
            port: 5173,
        },
        build: {
            outDir: 'dist',
            sourcemap: false,
        },
    });
});
