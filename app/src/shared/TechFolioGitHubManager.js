import Store from 'electron-store';
import moment from 'moment';

/**
 * TechFolioGitHubManager provides persistent access to the following GitHub state variables:
 *
 *   * OAuth token
 *   * username
 *   * remote repo name.
 *
 * It also provides an in-memory reference to the output of GitHub and Git commands.
 * The techFolioGitHubManager object is attached to the app object at system startup time.
 */
class TechFolioGitHubManager {
  constructor() {
    this.commandLogEntries = [];
    this.store = new Store({ name: 'TechFolioGitHubManager', defaults: { token: null, username: null, repo: null } });
  }

  /**
   * Set property to value.
   * @param property Should be one of 'token', 'username', or 'repo'.
   * @param value The value to be associated with the property.
   */
  set(property, value) {
    this.store.set(property, value);
  }

  /**
   * Return the property value.
   * @param property Property should be one of 'token', 'username', or 'repo'.
   * @return The value of property.
   */
  get(property) {
    return this.store.get(property);
  }

  /**
   * Clears the property value.
   * @param property One of 'token', 'username', or 'repo'.
   */
  clear(property) {
    this.store.set(property, null);
  }

  clearAll() {
    ['token', 'username', 'repo'].map(field => this.clear(field));
  }

  addLog(logString) {
    this.commandLogEntries.unshift({ timestamp: moment(), data: logString });
  }

  getLogs() {
    return this.commandLogEntries;
  }
}

const techFolioGitHubManager = new TechFolioGitHubManager();

export default techFolioGitHubManager;