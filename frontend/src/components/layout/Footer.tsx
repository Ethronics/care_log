import styles from './Footer.module.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>
        <p className={styles.copyright}>
          © {year} Log My Care – Smart Edition. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
