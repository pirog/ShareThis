// $Id$

/**
 * Drupal ShareThis behaviors.
 */
Drupal.behaviors.shareThis = function() {
  // Check the kill-switch.
  if (Drupal.settings.shareThisEnabled != true) {
    // See if there are any actual elements to apply the ShareThis to.
    if (Drupal.settings.shareThis) {
      // Process ShareThis after the API is loaded.
      jQuery.getScript(Drupal.settings.shareThisUrl, function() {
        for (shareThis in Drupal.settings.shareThis) {
          // Retrieve the values.
          var share = Drupal.settings.shareThis[shareThis];
          var id = share.id;
          var options = share.options;
          var element = share.element;

          // Create the entry and attach it to the link.
          Drupal.settings.shareThis[shareThis] = SHARETHIS.addEntry(options, element);
          Drupal.settings.shareThis[shareThis].attachButton($('#' + id).get(0));

    	  // Insert the new button, hiding the original link.
          $('#' + id).after(Drupal.settings.shareThis[shareThis].button).empty();

          // ShareThis won't appear unless we mimic the original clicking element link.
          $('#' + id + ' stbutton').click('Drupal.settings.shareThis[' + shareThis + '].share');
    	}
      });
    }
    Drupal.settings.shareThisEnabled = true;
  }
}
