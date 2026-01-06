<?php
/**
 * Footer template
 *
 * @package Polymorphic_Theme
 * @since   1.0.0
 */

?>
    <footer id="colophon" class="site-footer">
        <?php if ( is_active_sidebar( 'footer-1' ) ) : ?>
            <div class="footer-widgets">
                <?php dynamic_sidebar( 'footer-1' ); ?>
            </div>
        <?php endif; ?>

        <div class="site-info">
            <p>
                &copy; <?php echo esc_html( date_i18n( 'Y' ) ); ?>
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>">
                    <?php bloginfo( 'name' ); ?>
                </a>
            </p>
        </div>
    </footer>
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
