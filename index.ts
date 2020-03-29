import { dbConfig, PORT } from './config';
import { server } from './src';

!module.parent && (async () => {
    await dbConfig();

    server.listen(PORT, () => {
        console.log(`Server started on port: ${PORT}`);
    });

    // (['SIGINT', 'SIGTERM'] as Signals[]).forEach(
    //     signal => process.on(signal, () => process.exit()),
    // );
})();
