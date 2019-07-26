import Document, { Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {

  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <html>
        <Head></Head>
        <body>
          <Main />
          <NextScript />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.1.6/js/uikit.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.1.6/js/uikit-icons.min.js"></script>
        </body>
      </html>
    );
  }
}