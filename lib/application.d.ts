/** Represents an application providing functionalities specific to console requests. */
export declare class Application {
    /** The application singleton. */
    static get instance(): Application;
    /** The default number of workers. */
    static readonly defaultWorkerCount: number;
    /** The format used for logging the requests. */
    static readonly logFormat: string;
    /** The version number of the package. */
    static readonly version: string;
    /** The message logger. */
    logger: Console;
    /** Creates a new application. */
    constructor();
    /** Value indicating whether the application runs in debug mode. */
    get debug(): boolean;
    /** The application environment. */
    get environment(): string;
    /**
     * Terminates the application.
     * @param status The exit status.
     */
    end(status?: number): void;
    /**
     * Initializes the application.
     * @param args The command line arguments.
     */
    init(args?: {}): Promise<void>;
    /**
     * Runs the application.
     * @param args The command line arguments.
     */
    run(args?: string[]): Promise;
    /**
     * Parses the command line arguments.
     * @param args The command line arguments.
     */
    private _parseCommandLineArguments;
    /**
     * Parses the specified configuration data.
     * @param config A string specifying the application configuration.
     * @return The server instances corresponding to the parsed configuration.
     * @throws `TypeError` The specified configuration is invalid.
     */
    private _parseConfiguration;
    /**
     * Starts the request workers.
     * @return Completes when the workers have been started.
     */
    private _startWorkers;
}
