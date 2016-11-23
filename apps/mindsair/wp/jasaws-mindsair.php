<?php
/**
 * @package mindsair 
 * @version 0.1
 *
 * @wordpress-plugin
 * Plugin Name:       Mindsair 
 * Plugin URI:        http://wordpress.org/plugins/jasaws-mindsair/
 * Description:       Free wordpress chat plugin
 * Version:           0.1
 * Author:            Darren Liew
 * Author URI:        http://jasaws.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       jasaws-mindsair
 * Domain Path:       /languages
 * Network:           False
 */
// If this file is called directly, abort.
if (!defined('WPINC')) die;

define('MINDSAIR_DOMAIN', "//54.83.28.108/mindsair/");

load_plugin_textdomain('jasaws-mindsair', false, 'wp-content/plugins/jasaws-mindsair');

add_action('init', 'mindsair_init');
add_action('wp_footer', 'mindsair_add_div');
add_action('wp_enqueue_scripts', 'mindsair_enqueue_script');
add_action('wp_ajax_mindsair_save_settings', 'mindsair_save_settings');
add_filter('plugin_action_links', 'mindsair_name_links', 10, 2); // under name
add_filter('plugin_row_meta', 'mindsair_desc_links',10,2); // under description
add_filter('clean_url','mindsair_add_dataset',10,3); // add dataset
register_deactivation_hook(__FILE__, 'mindsair_uninstall');
register_uninstall_hook(__FILE__, 'mindsair_uninstall');

function mindsair_init(){
	if (function_exists('current_user_can') && current_user_can('manage_options')){
		add_action('admin_menu','mindsair_add_settings_page');
		add_action('admin_menu','mindsair_create_menu');
	}
}

/**
* Mindsair Settings page.  Once user acivates mindsair account, Dialog ID must be entered here to activate chat
*/
function mindsair_add_settings_page() {
	function mindsair_settings_page() {
		?>
		<div class="wrap">
		<img src="<?php echo plugin_dir_url( __FILE__ ).'main-logo.png'; ?>"/>
		<div class="metabox-holder meta-box-sortables ui-sortable pointer">
		<div class="postbox" style="float:left;width:40em;margin-right:10px">
		<div class="inside" style="padding: 0 10px">
		<form method="post" action="options.php">
		<p style="text-align:center">
		<?php wp_nonce_field('update-options') ?>
		<p><label for="mindsairId">Activate Mindsair messenger by entering the mindsairId received when registering.

		<?php if(trim(get_option('mindsairId')) == "") { ?>
		If you don't have an account, click <a href="admin.php?page=mindsair_dashboard">here</a> to get started.
		<?php } ?>
		<input type="text" name="mindsairId" id="mindsairId" value="<?php echo(get_option('mindsairId')) ?>" style="width:100%" /></p>
		<p class="submit" style="padding:0">
		<input type="hidden" name="action" value="update" />
		<input type="hidden" name="page_options" value="mindsairId" />
		<input type="submit" name="mindsairSettingsSubmit" id="mindsairSettingsSubmit" value="<?php _e('Save Settings') ?>" class="button-primary" /> </p>
		</form>
		</div>
		</div>
		</div>
		</div>

		<?php
	}
	add_submenu_page('options-general.php', __('Mindsair Settings'), __('Mindsair'), 'manage_options', 'mindsair', 'mindsair_settings_page');
}

function mindsair_save_settings() {
	if (!wp_verify_nonce($_GET['_wpnonce'],'update-options')) {
		echo "Error";
	    die( 'Security check' );
	} else {
	    $mindsairId = trim($_GET['mindsairId']);
		if(!add_option('mindsairId', $mindsairId)) {
			update_option('mindsairId', $mindsairId);
		}
		echo "Success";
		die(); // this is required to return a proper result
	}
}

function mindsair_create_menu() {
	//create new top-level menu
	add_menu_page(__('Mindsair Dashboard'), __('Mindsair'), 'administrator', 'mindsair_dashboard', 'mindsair_dashboard', plugin_dir_url( __FILE__ ).'logo.png');
}

function mindsair_uninstall() {
	delete_option('mindsairId');
}
/**
* iframe in the live chat page if a mindsairId exists for this user.
* Otherwise, iframe in the registration page.
*/
function mindsair_dashboard() {
	?>
	<br /> <br />
	<img src="<?php echo plugin_dir_url( __FILE__ ).'main-logo.png'; ?>"/>

	<?php if(!get_option('mindsairId')){ ?>
		<form method="post" id="optionsform" action="options.php">
		<div class="error settings-error" id="setting-error-invalid_admin_email" style="margin: 4px 0px 5px 0px; width: 1100px;">
		<p style="padding:0px;">
		<a href="<?=MINDSAIR_DOMAIN?>signup" target="_blank">Sign Up</a> and save the mindsairId you receive to activate your account.<br/><br/>
		<?php wp_nonce_field('update-options') ?>
		<label for="mindsairId">
		<input type="text" name="mindsairId" id="mindsairId" value="<?php echo(get_option('mindsairId')) ?>" style="width:300px" />
		<input type="hidden" name="page_options" value="mindsairId" />
		<input type="submit" onclick="saveDialogSettings();return false;" name="mindsairSettingsSubmit" id="mindsairSettingsSubmit" value="<?php _e('Save Settings') ?>" class="button-primary" />
		</p>
		</div>
		</form>
		<p id="successMessage" style="display:none; color:green;">Your settings were saved successfully. Your dalog widget should now appear on your website!</p>
		<p id="failureMessage" style="display:none; color:red;">There was an error saving your settings. Please try again.</p>
	<?php } ?>

	<div class="metabox-holder" id="mindsairLinks" <?php  if(!get_option('mindsairId')){echo 'style="display:none"';} ?> >
	<div class="postbox">
	<div style="padding:10px;">
	<a href="<?=MINDSAIR_DOMAIN?>chat" target="_blank">Launch</a> mindsair messenger
	<br/><br/>
	<a href="<?=MINDSAIR_DOMAIN?>help" target="_blank">View</a> our help center if you have any questions.
	<br/><br/>
	<a href="options-general.php?page=mindsair">Modify</a> my mindsairId.
	</div>
	</div>
	</div>

	<script>
		function verifyDialogId() {
			if(jQuery('#mindsairId').val().trim().length != 36) return false;
			return true;
		}
		function saveDialogSettings(){
			if(!verifyDialogId()) return alert('You entered an invalid mindsairId. Please try again.');
			var data = { action: 'mindsair_save_settings' };
			jQuery.post(ajaxurl + '?' + jQuery('#optionsform').serialize(), data, function(response){
				if('Success'===response){
					jQuery('#optionsform').hide();
					jQuery('#failureMessage').hide();
					jQuery('#successMessage').show();
					jQuery('#mindsairLinks').slideDown(600);
					setTimeout(function(){jQuery("#successMessage").slideUp(1000)}, 10000);
				} else {
					jQuery('#failureMessage').show();
				}
			});
		}
	</script>
	<?php
}

/**
* The actual mindsair script to create the chat button on the wordpress site.
*/
function mindsair_add_div() {
    if(get_option('mindsairId')) {
		?>
		<div class=__></div>
		<?php
    }
}

function mindsair_add_dataset( $good_protocol_url, $original_url, $_context){
	if (!strpos($original_url, MINDSAIR_DOMAIN)) return $good_protocol_url;

	remove_filter('clean_url','mindsair_add_dataset',10,3);
	$url_parts = parse_url($good_protocol_url);
	return $url_parts['scheme'] . '://' . $url_parts['host'] . $url_parts['path'] . "' data-default-group='/1/Glueon";
}

function mindsair_enqueue_script(){
	wp_enqueue_script(
		'mindsair.js',
		MINDSAIR_DOMAIN.'app/bin/wp/project.js',
		array( 'underscore', 'backbone' ),
		'1.0',
		true // Load JS in footer so that templates in DOM can be referenced.
	);
}

function mindsair_name_links($links, $file) {
    if(function_exists('admin_url') && plugin_basename(__FILE__) === $file) {
        if(trim(get_option('mindsairId')) === "") {
        	$settings_link = '<a href="'.admin_url('options-general.php?page=mindsair').'">'.__('Setup').'</a>';
        }
        else {
        	$settings_link = '<a href="'.admin_url('admin.php?page=mindsair_dashboard').'">'.__('Dashboard').'</a>';
        }
        array_unshift($links, $settings_link);
    }
    return $links;
}

function mindsair_desc_links($links, $file) {
	if ($file === plugin_basename(__FILE__)) {
		$links[] = '<a href="options-general.php?page=mindsair">' . __('Settings') . '</a>';
	}
	return $links;
}
