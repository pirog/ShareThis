<?php
// $Id: sharethis_handler_link.inc,v 1.1.2.3 2009/08/14 03:52:42 robloach Exp $
/**
 * Field handler to present a link node edit.
 */
class sharethis_handler_link extends views_handler_field_node_link {

  function render($values) {
    $node = new stdClass();
    $node->nid = $values->{$this->aliases['nid']};

    return theme('sharethis', $data_options, $node->nid);
  }
}
