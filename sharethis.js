// $Id$

/**
 * Drupal ShareThis behaviors.
 */
Drupal.behaviors.shareThis = function() {
  // Check the kill-switch.
  if (Drupal.settings.shareThisEnabled != true) {
    // See if there are any actual elements to apply the ShareThis to.
    if (Drupal.settings.shareThisUrl) {
      // Process ShareThis after the API is loaded.
      jQuery.ajax({
        type: "GET",
        url: Drupal.settings.shareThisUrl,
        dataType: "script",
        cache: true,
        success: function() {
          // Prepare the ShareThis API.
          SHARETHIS.toolbar = true;
          SHARETHIS.onReady();

          // Say that the ShareThis API is now available and recall the behaviors.
          Drupal.settings.shareThisEnabled = true;
          Drupal.behaviors.shareThis();
        }
      });
    }
  }
  else {
    // Process each of the ShareThis links.
    $('.sharethis-sharethis:not(.sharethis-processed)').each(function(index, element) {
      // Obtain the element and construct the options.
      element = $(element);
      var options = {
        'url': element.attr('href'),
        'title': element.attr('title')
      };

      // Create the entry and attach it to the link.
      var share = SHARETHIS.addEntry(options);
      share.attachButton(element.get(0));

      // State that the object was processed and deactivate the default click event.
      element.addClass('sharethis-processed').click(function() {
        return false;
      });
    });
  }
};
