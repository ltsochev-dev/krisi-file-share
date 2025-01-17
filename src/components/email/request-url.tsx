import {
  Html,
  Button,
  Text,
  Body,
  Tailwind,
  Section,
  Row,
  Hr,
  Container,
} from "@react-email/components";

export interface RequestUrlProps {
  name: string;
  email: string;
  reason: string;
}

export default function RequestUrl({ name, email, reason }: RequestUrlProps) {
  return (
    <Html lang="en">
      <Body>
        <Tailwind>
          <Text className="pb-4">Hello Kristina,</Text>
          <Text className="py-2">
            You have a new URL sharing request from{" "}
            <strong>
              {name}({email})
            </strong>
          </Text>
          <Section>
            <Row>
              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
              <Text>The user provided the following reason:</Text>
            </Row>
            <Row>
              <Container className="bg-gray-400">
                <Text className="px-[12px] text-white">{reason}</Text>
              </Container>
            </Row>
            <Row>
              <Button href="https://share.kristinakostova.com/admin">
                Go to admin panel
              </Button>
            </Row>
          </Section>
        </Tailwind>
      </Body>
    </Html>
  );
}
