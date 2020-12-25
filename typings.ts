declare namespace Elixire {
  interface Options {
    /**
     * Useragent sent within Request headers
     *
     *defaults to
     * `node-elixire/version (creator-url)`
     */
    useragent?: string;
    /**
     * Elixire instance defaults to `elixi.re`
     */
    instance_url: string;
    /**
     * 
     */
    sleep: number
    /**
     * API Key from your Elixire Instance
     *
     */
    apikey: string;

    /**
     * Required if you do not supply a API-Key, used for generating a non-timed token.
     */
    // username?: string;
    /**
     * Required if you do not supply a API-Key, used for generating a non-timed token.
     */
    // password?: string;
  }

  // ! AUTHENTICATION INTERFACES

  interface ErrorResponse {
    error: boolean;
    message: string;
  }

  interface LoginInput {
    user: string;
    password: string;
  }

  interface LoginOutput {
    /**
     * Returns a Timed Token
     */
    token: string;
  }

  interface APIKeyInput {
    user: string;
    password: string;
  }

  interface APIKeyOutput {
    /**
     * Returns a non-timed token
     */
    api_key: string;
  }

  interface RevokeInput {
    user: string;
    password: string;
  }

  interface RevokeOutput {
    success: boolean;
  }

  // ! PROFILE INTERFACES
  /**
   * Lists all available Domains to the current user
   *
   * If no Authorization is supplied, only non-admin Domains are listed
   */
  interface Domains {
    domains: { [key: number]: string };
    officialdomains: number[];
  }

  /**
   * Retrieves your basic Account information
   *
   * - Requires Authentication
   */
  interface GetProfile {
    /**
     * Returns a Snowflake ID as a String
     */
    user_id: string;
    username: string;

    /**
     * Inactive Accounts cannot interact with the service
     */
    active: boolean;
    admin: boolean;
    /**
     * Domain ID of the currently used Domain
     */
    domain: number;
    /**
     * Retuns the subdomain of the currently used domain
     *
     * Example:
     *
     * `uwu`.elixi.re
     */
    subdomain?: string;
    email: string;
    limits: {
      limit: number;
      used: number;
      shortenlimit: number;
      shortenused: number;
    };
  }
  /**
   * - Authentication Required.
   * - Changing your Password will invalidate all your tokens.
   *
   * Modifies Profile Information
   *
   * All Keys are optional, only `consented` may be `null`
   */
  interface PatchProfile {
    password?: string;
    /**
     * Requires `password` if specified
     */
    new_password?: string;
    /**
     * Domain ID
     */
    domain?: number;
    /**
     * Subdomain to be used if domain is a Wildcard
     *
     * @max 0-63 Characters
     */
    subdomain?: string;
    /**
     * DomainID to be used for shortening.
     *
     * Specify `null` if you want to inherit from the uploading domain (`domain`)
     */
    shorten_domain?: number;
    email?: string;
    /**
     * Data Processing consent status. `null` means that the use rwill be promted for their consent on the Website
     */
    consented?: null | boolean;
    /**
     * Determines the minimum amount of characters on generated shortnames.
     *
     * `true` gets 8+ | `false` gets 3+
     */
    paranoid?: boolean;
  }

  interface PatchProfileOutput {
    updated_fields: string[];
  }

  interface GetLimitsOutput {
    limit: number;
    used: number;
    shortenlimit: number;
    shortenused: number;
  }

  /**
   * - Requires Authentication
   *
   * Makes a Account Deletion Request, Sends an Email to your Account asking for Confirmation.
   */
  interface DeleteAccountInput {
    password: string;
  }

  interface DeleteAccountOutput {
    success: boolean;
  }

  /**
   * Makes a "Reset Password" request, Sends an Email to your Account asking for Confirmation.
   */
  interface ResetPasswordInput {
    user: string;
  }
  interface ResetPasswordOutput {
    success: boolean;
  }

  // ! Upload/Shorten INTERFACES
  /**
   * - Requires Authentication
   *
   * Uploads a file to be hosted on the Service
   */
  interface UploadInput {
    buffer: Buffer;
    // token: string;
  }

  interface UploadOutput {
    url: string;
    shortname: string;
    delete_url: string;
  }

  interface ShortenInput {
    url: string;
  }
  interface ShortenOutput {
    url: string;
  }
  /**
   * - Requires Authentication
   */
  interface DeleteFileInput {
    filename: string;
  }

  interface DeleteFileOutput {
    success: boolean;
  }

  interface UploadList {
    success: boolean;
    files: {
      [shortname: string]: {
        snowflake: string;
        shortname: string;
        /**
         * Size of the File in Bytes
         */
        size: number;
        url: string;
        thumbnail: string;
      };
    };
    shortens: {
      [shortname: string]: {
        snowflake: string;
        shortname: string;
        /**
         * the URL that the shortened URL points to
         */
        redirto: string;
        /**
         * the shortened URL
         */
        url: string;
      };
    };
  }
  /**
   * - Requires Authentication
   *
   * Deletes Shortened Links
   */
  interface ShortenDeleteInput {
    /**
     * the shortcode of the shortened link to delete
     *
     * example:
     *
     * the shortcode of `elixi.re/s/abc` is `abc`
     */

    filename: string;
  }

  interface ShortenDeleteOutput {
    success: boolean;
  }
  /**
   * - Requires Authentication
   *
   * Deletes all files a user has.
   * There is no going back from this operation
   */
  interface DeleteAllInput {
    password: string;
  }
  interface DeleteAllOutput {
    success: boolean;
  }

  // ! DATA DUMP INTERFACES
  /**
   * Requests a data dump do be delivered to your Email.
   */
  interface DataDumpRequest {
    success: boolean;
  }
  interface DataDumpStatus {
    /**
     * Valid States are:
     *
     * `in_queue` || `not_in_queue` || `processing`
     */
    state: string;

    /**
     * Only present when `state` is `processing`
     *
     * the ISO 8601 timestamp of when the dump generation started
     */
    start_timestamp?: string;
    /**
     * Only present when `state` is `processing`
     */
    current_id?: string;
    /**
     * Only present when `state` is `processing`
     */
    total_files?: number;
    /**
     * Only present when `state` is `processing`
     */
    files_done?: number;

    /**
     * Only present when `state` is `in_queue`
     */
    position?: number;
  }

  interface AdminDumpStatus {
    queue: string[];
    current: {
      user_id: number;
      total_files: number;
      files_done: number;
    };
  }

  // ! STAT INTERFACES
  /**
   * - Requires Authentification
   *
   * Gives Statistics about domains the user owns
   */
  interface MyDomainStats {
    [domain_id: string]: {
      info: {
        domain: string;
        official: boolean;
        admin_only: boolean;
        cf_enabled: boolean;
        permissions: number;
      };
      stats: {
        users: number;
        files: number;
        shortens: number;
      };
    };
  }

  // ! MISC INTERFACES
  interface RecoverUsernameInput {
    email: string;
  }
  interface RecoverUsernameOutput {
    success: boolean;
  }
  interface Hewwo {
    name: string;
    version: string;
    api: string;
  }
  interface Science { }

  /**
   * Gives days until 100th anniversary of Treaty of Lausanne ("Lausanne"), also returns if we're World™ Power™ or not.
2023 is promised as the year where Turkey will become a World™ Power™ by the government.
Supposedly end of Lausanne (which actually doesn't have an end date, but don't tell them that) will mean that Turkey will be able to mine Boron (we already do actually, and Lausanne doesn't block that) and get everyone rich.
   */
  interface Boron {
    world_power: boolean;
    days_until_world_power: number;
  }
  /**
   * Lists featues of the running instance
   */
  interface Features {
    uploads: boolean;
    shortens: boolean;
    registrations: boolean;
    pfupdate: boolean;
  }
}
export = Elixire;
