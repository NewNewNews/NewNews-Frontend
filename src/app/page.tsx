import ClientOnly from "@/components/ClientOnly";
import Container from "@/components/Container";
import NewsList from "@/components/news/NewsList";

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
