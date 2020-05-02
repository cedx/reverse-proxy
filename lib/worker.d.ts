import { ServerOptions } from './server.js';
/** Contains all public information and methods about a request worker. */
export declare class Worker {
    #private;
    /**
     * Stops the worker from accepting new connections.
     * @return Completes when all the servers managed by this worker are finally closed.
     */
    stop(): Promise<void>;
    /**
     * Begins accepting connections.
     * @param servers The settings of the servers managed by this worker.
     * @return The ports that the servers managed by this worker are running on.
     */
    start(servers?: ServerOptions[]): Promise<number[]>;
    /**
     * Extracts the user name provided in the specified `Authorization` header.
     * @param authorization The value of the `Authorization` header.
     * @return The user name found, otherwise the string `"-"`.
     */
    private _extractUserFromRequest;
}
