export interface CategoryConstant {
    id: string;
    name: string;
    slug: string;
    iconUrl: string;
    description: string;
}

export const Category: CategoryConstant[] = [
    {
        id: "c1",
        name: "Trang điểm cô dâu",
        slug: "trang-diem-co-dau",
        iconUrl: "gem",
        description: "Lộng lẫy nhất trong ngày trọng đại"
    },
    {
        id: "c2",
        name: "Thời trang / Sự kiện",
        slug: "thoi-trang-su-kien",
        iconUrl: "sparkles",
        description: "Nổi bật giữa đám đông"
    },
    {
        id: "c3",
        name: "Tiệc tối",
        slug: "tiec-toi",
        iconUrl: "palette",
        description: "Quyến rũ và sang trọng"
    },
    {
        id: "c4",
        name: "Khóa học",
        slug: "khoa-hoc",
        iconUrl: "graduation-cap",
        description: "Nâng tầm kỹ năng makeup"
    }
];