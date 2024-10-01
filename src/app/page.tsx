import ClientOnly from "@/components/ClientOnly";
import Container from "@/components/Container";
import getNews from "./actions/getNews";
import NewsList from "@/components/modals/NewsList";

export default async function Home() {
  const news = await getNews();
  // const isEmpty = true;

  // if (isEmpty) {
  //   return (
  //     <ClientOnly>
  //       <Container>
  //         <div className="pt-24 grid grid-cols-1 sm:grid-cls-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
  //           <div>No Selected News</div>
  //         </div>
  //       </Container>
  //     </ClientOnly>
  //   );
  // }

  return (
    <ClientOnly>
      <Container>
      <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Latest News</h1>
            <NewsList />
        </div>
        {/* <div className="pt-24 grid grid-cols-1 sm:grid-cls-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          <div>Latest News</div>
          <NewsList />
        </div> */}
      </Container>
    </ClientOnly>
  );
}
