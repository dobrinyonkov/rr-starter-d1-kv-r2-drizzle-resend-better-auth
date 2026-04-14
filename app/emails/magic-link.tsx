import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";

export function MagicLinkEmail({ url }: { url: string }) {
	return (
		<Html>
			<Head />
			<Preview>Your sign-in link</Preview>
			<Body style={body}>
				<Container style={container}>
					<Heading style={heading}>Sign in to Starter</Heading>
					<Section style={section}>
						<Text style={text}>
							Click the link below to sign in. This link expires in 5 minutes.
						</Text>
						<Link href={url} style={link}>
							Sign in
						</Link>
					</Section>
					<Text style={footer}>
						If you didn't request this, you can safely ignore this email.
					</Text>
				</Container>
			</Body>
		</Html>
	);
}

const body = {
	backgroundColor: "#f9fafb",
	fontFamily: "system-ui, sans-serif",
};
const container = { margin: "40px auto", padding: "20px", maxWidth: "480px" };
const heading = {
	fontSize: "24px",
	fontWeight: "bold" as const,
	textAlign: "center" as const,
};
const section = {
	padding: "24px",
	backgroundColor: "#ffffff",
	borderRadius: "8px",
	textAlign: "center" as const,
};
const text = { fontSize: "14px", color: "#374151", lineHeight: "24px" };
const link = {
	display: "inline-block",
	padding: "12px 24px",
	backgroundColor: "#171717",
	color: "#ffffff",
	borderRadius: "6px",
	fontSize: "14px",
	fontWeight: "500" as const,
	textDecoration: "none",
	marginTop: "16px",
};
const footer = {
	fontSize: "12px",
	color: "#9ca3af",
	textAlign: "center" as const,
	marginTop: "24px",
};
