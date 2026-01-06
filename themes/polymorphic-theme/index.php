<?php
/**
 * The main template file
 *
 * @package Polymorphic_Theme
 * @since   1.0.0
 */

get_header();
?>

<main id="main" class="site-main" role="main">
    <?php
    if ( have_posts() ) :
        while ( have_posts() ) :
            the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <?php if ( is_singular() ) : ?>
                    <header class="entry-header">
                        <?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
                    </header>
                <?php else : ?>
                    <header class="entry-header">
                        <?php the_title( sprintf( '<h2 class="entry-title"><a href="%s">', esc_url( get_permalink() ) ), '</a></h2>' ); ?>
                    </header>
                <?php endif; ?>

                <div class="entry-content">
                    <?php
                    if ( is_singular() ) {
                        the_content();
                    } else {
                        the_excerpt();
                    }
                    ?>
                </div>
            </article>
            <?php
        endwhile;

        the_posts_navigation();
    else :
        ?>
        <p><?php esc_html_e( 'No content found.', 'polymorphic-theme' ); ?></p>
        <?php
    endif;
    ?>
</main>

<?php
get_footer();
