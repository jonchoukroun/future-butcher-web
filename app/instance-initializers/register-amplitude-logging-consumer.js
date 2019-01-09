/**
 * Provide application-specific information to Amplitude service.
 */
export default {
  name: 'register-amplitude-logging-consumer',
  after: 'ember-logging-amplitude',
  initialize(applicationInstance) {
    // Set up a callback that pulls the relevant Amplititude application/user
    // data from the application provided context.
    let consumer = applicationInstance.lookup('service:amplitudeLoggingConsumer');

    /**
     * This callback is called automatically when sending an event to Amplitude
     * to determine the context of the event.  Provide the following information
     * either directly or from the logger event context.
     * @param  {Object} context Any application or user context from the event.
     * @return {Object}         Amplitude context:
     *                          - applicationVersion: The current application
     *                            version
     *                          - userId: The current user id
     *                          - userProperties: Any user-specific properties
     */
    let contextCallback = (context) => {
      context = (context === null || context === undefined) ? {} : context;
      
      return {
        applicationVersion: context.application || '',
        userId: context.user || '',
        userProperties: {}
      };
    };
    consumer.set('applicationContextCallback', contextCallback);
  }
};
