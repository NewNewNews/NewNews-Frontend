
"use client";
import { useState } from "react";
import NewsCard from "../NewsCard";
import Modal from "./Modal";

const mockNews = [
    {
        data: "วันที่ 13 ก.ย. น.ส.กาญจนา โชคไพศาลศิลป์ ผู้บริหารงานวิจัย ศูนย์วิจัยกสิกรไทย เปิดเผยว่า เงินบาทแตะระดับแข็งค่าสุดในรอบ 19 เดือนครั้งใหม่ ที่ 33.32 บาทต่อดอลลาร์ (แข็งค่าสุดนับตั้งแต่ต้นเดือนกุมภาพันธ์ 2566) ก่อนจะกลับมาปรับตัวอยู่ที่ระดับ 33.33-33.35 บาทต่อดอลลาร์ ในช่วงเช้าวันนี้ (08.35 น.) แข็งค่าขึ้นเมื่อเทียบกับระดับปิดตลาดวานนี้ที่ 33.75 บาทต่อดอลลาร์ ทั้งนี้ เงินบาทขยับแข็งค่าขึ้น โดยมีแรงหนุนสำคัญจากการพุ่งขึ้นของราคาทองคำในตลาดโลกที่ทำสถิติสูงสุดเป็นประวัติการณ์ครั้งใหม่ ประกอบกับน่าจะมีแรงหนุนเพิ่มเติมจากแรงขายเงินดอลลาร์ โดยเฉพาะเมื่อเทียบกับเงินยูโร หลังการประชุมธนาคารกลางยุโรป เพราะแม้ธนาคารกลางยุโรป จะมีการปรับลดอัตราดอกเบี้ยในการประชุมรอบนี้ลง 0.25% ตามที่ตลาดคาด แต่ยังไม่มีสัญญาณลดดอกเบี้ยในการประชุมรอบหน้าในเดือนตุลาคม นอกจากนี้ เงินดอลลาร์ ยังมีปัจจัยลบจากตัวเลขเศรษฐกิจสหรัฐ ทั้งจำนวนผู้ขอรับสวัสดิการว่างงานรายสัปดาห์ และดัชนีราคาผู้ผลิตที่ออกมาต่ำกว่าตัวเลขคาดการณ์ของตลาดด้วยเช่นกัน สำหรับกรอบการเคลื่อนไหวของเงินบาทในวันนี้ ประเมินเบื้องต้นไว้ที่ 33.25-33.55 บาทต่อดอลลาร์ ขณะที่ปัจจัยสำคัญที่ต้องติดตาม ได้แก่ ทิศทางเงินทุนต่างชาติ สถานการณ์สกุลเงินในเอเชีย ตัวเลขการผลิตภาคอุตสาหกรรมเดือน ก.ค. ของยูโรโซน และดัชนีความเชื่อมั่นผู้บริโภค (เบื้องต้น) เดือน ก.ย. ของสหรัฐ",
        category: "เศรษฐกิจ",
        date: "2024-09-13T04:35:55+00:00",
        publisher: "Dailynews",
        url: "https://www.dailynews.co.th/news/3857816/",
        actionId: "10",
        disabled: false,
    },
    {
        data: "Breaking News: Market Hits All-Time High",
        category: "Finance",
        date: "2024-10-01",
        publisher: "The Financial Times",
        url: "http://example.com/market-high",
        actionId: "1",
        disabled: false,
    },
    {
        data: "New Technology Revolutionizes Transportation",
        category: "Technology",
        date: "2024-09-30",
        publisher: "Tech Crunch",
        url: "http://example.com/transportation-tech",
        actionId: "2",
        disabled: false,
    },
    {
        data: "Health Experts Warn of Flu Season Surge",
        category: "Health",
        date: "2024-09-29",
        publisher: "Health Daily",
        url: "http://example.com/flu-season",
        actionId: "3",
        disabled: false,
    },
    {
        data: "Local Sports Team Wins Championship",
        category: "Sports",
        date: "2024-09-28",
        publisher: "Sports News",
        url: "http://example.com/sports-championship",
        actionId: "4",
        disabled: false,
    },
    {
        data: "New Study Reveals Impact of Climate Change",
        category: "Environment",
        date: "2024-09-27",
        publisher: "Eco Times",
        url: "http://example.com/climate-change",
        actionId: "5",
        disabled: false,
    },
];

const NewsList: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<any>(null); // Change type according to your needs

    const handleCardClick = (news: any) => {
        setSelectedNews(news); // Set the selected news
        setModalOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedNews(null);
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('th-TH', options); // Format to Thai locale
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockNews.map((news) => (
                    <NewsCard
                        key={news.actionId}
                        data={news.data}
                        category={news.category}
                        date={formatDate(news.date)}
                        publisher={news.publisher}
                        url={news.url}
                        actionId={news.actionId}
                        disabled={news.disabled}
                        onClick={() => handleCardClick(news)} // Pass click handler
                    />
                ))}
            </div>

            {selectedNews && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleCloseModal}
                    title={selectedNews.publisher} // Use news data as title
                    body={
                        <div>
                            <p><strong>Data:</strong> {selectedNews.data}</p>
                            <p><strong>Date:</strong> {selectedNews.date}</p>
                            <p><strong>Publisher:</strong> {selectedNews.publisher}</p>
                            <p><strong>URL:</strong> <a href={selectedNews.url} target="_blank" rel="noopener noreferrer">{selectedNews.url}</a></p>
                        </div>
                    }
                    actionlabel="Close"
                />
            )}
        </>
    );
};

export default NewsList;
