const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        position: "fixed",
        bottom: 0,
        width: "100%",
        borderTop: "1px solid #ccc",
        zIndex: -1000,
      }}
    >
      <p style={{ color: "#ff3385", margin: 0 }}>
        © 2024 Portfolio App. Made with 🔥.
      </p>
    </footer>
  );
};
export default Footer;
