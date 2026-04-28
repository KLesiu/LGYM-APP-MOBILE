import React, { type ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, type ListRenderItem, Text, View } from "react-native";
import Animated, {
	Easing,
	FadeIn,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";
import type { UserBaseInfoDto } from "../../../../api/generated/model";
import { useGetApiGetUsersRanking } from "../../../../api/generated/user/user";
import colors from "../../../../constants/colors";
import { useAuthStore } from "../../../../stores/useAuthStore";
import Card from "../../elements/Card";

const RANK_COLORS = {
	gold: colors.rankGold || "#FFD700",
	cyanLight: colors.rankCyanLight || "#e0f7fa",
	cyan: colors.rankCyan || "#88ddff",
	cyanDark: colors.rankCyanDark || "#20c2d7",
};

const RankPulse = ({ children }: { children: ReactNode }) => {
	const scale = useSharedValue(1);

	useEffect(() => {
		scale.value = withRepeat(
			withTiming(1.04, {
				duration: 1000,
				easing: Easing.inOut(Easing.ease),
			}),
			-1,
			true,
		);
	}, [scale]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

const UsersRanking: React.FC = () => {
	const { t } = useTranslation();
	const [ranking, setRanking] = useState<UserBaseInfoDto[]>([]);
  const user = useAuthStore((state) => state.user);
	const { data, isLoading } = useGetApiGetUsersRanking();

	useEffect(() => {
		if (data?.data && Array.isArray(data.data)) {
			setRanking(data.data);
		}
	}, [data]);

	const getRankStyle = (index: number, userName: string) => {
		let color = RANK_COLORS.cyanLight;
		let fontFamily = "OpenSans_400Regular";
		let textPrefix = "";

		if (index === 0) {
			color = RANK_COLORS.gold;
			fontFamily = "OpenSans_700Bold";
			textPrefix = "🏆 ";
		}

		if (user && userName === user.name) {
			color = RANK_COLORS.cyanDark;
			fontFamily = "OpenSans_700Bold";
		}

		return { color, fontFamily, textPrefix };
	};

	const renderItem: ListRenderItem<UserBaseInfoDto> = ({
		item: ele,
		index,
	}) => {
		const userName = ele.name || "Unknown";
		const userElo = ele.elo ?? 0;
		const bgColor = index % 2 !== 0 ? "bg-black/20" : "bg-transparent";
		const { color, fontFamily, textPrefix } = getRankStyle(index, userName);

		const content = (
			<View className={`flex flex-row py-1 rounded-md items-center ${bgColor}`}>
				<Text
					className="mr-2 text-sm smallPhone:text-xs w-8 text-center"
					style={{ fontFamily: fontFamily, color: color }}
				>
					{index + 1}.
				</Text>
				<Text
					className="text-sm smallPhone:text-xs flex-1"
					style={{ fontFamily: fontFamily, color: color }}
				>
					{textPrefix}
					{userName} - {userElo} ELO
				</Text>
			</View>
		);

		if (index === 0) {
			return (
				<Animated.View entering={FadeIn.delay(index * 30).duration(300)}>
					<RankPulse>{content}</RankPulse>
				</Animated.View>
			);
		}

		return (
			<Animated.View entering={FadeIn.delay(index * 30).duration(300)}>
				{content}
			</Animated.View>
		);
	};

	return (
		<Card isLoading={isLoading} customClasses="flex-1">
			<View className="h-full w-full flex flex-col" style={{ gap: 4 }}>
				{/* --- Nagłówek --- */}
				<View
					className="flex flex-row justify-between items-center"
					style={{ gap: 2 }}
				>
					<Text
						className="text-lg smallPhone:text-base text-primaryColor"
						style={{ fontFamily: "OpenSans_700Bold" }}
					>
						{t("start.rankingTitle")}
					</Text>
				</View>

				{/* --- Lista rankingu --- */}
				<View className="flex-1 h-64 smh:h-52">
					<FlatList
						data={ranking}
						renderItem={renderItem}
						keyExtractor={(item, index) => item.name || index.toString()}
						showsVerticalScrollIndicator={false}
						ListFooterComponent={<View className="h-10 w-full" />}
					/>
				</View>
			</View>
		</Card>
	);
};

export default UsersRanking;
