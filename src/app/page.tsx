import ClientOnly from "@/components/ClientOnly";
import Container from "@/components/Container";
import getNews from "./actions/getNews";
import NewsList from "@/components/modals/NewsList";

export default async function Home() {
  return (
    <ClientOnly>
      <Container>
        <div className="container mx-auto p-4">
              <NewsList />
        </div>
      </Container>
    </ClientOnly>
  );
}
