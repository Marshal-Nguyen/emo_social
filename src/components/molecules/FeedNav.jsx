import React from "react";
import Button from "../atoms/Button";

const FEED_TABS = [
    { key: "most_recent", label: "Most Recent" },
    { key: "feed", label: "Feed" },
    { key: "news", label: "News" },
    { key: "mine", label: "Của tôi" },
];

const FeedNav = ({ selected, onSelect }) => (
    <nav className="flex gap-2">
        {FEED_TABS.map(tab => (
            <Button
                key={tab.key}
                variant={selected === tab.key ? "primary" : "secondary"}
                size="sm"
                onClick={() => onSelect(tab.key)}
                className="rounded-full text-sm font-medium"
            >
                {tab.label}
            </Button>
        ))}
    </nav>
);

export default FeedNav;
