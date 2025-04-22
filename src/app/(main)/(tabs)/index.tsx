import {
  useGetAIGeneratedGuide,
  useGetPDFGeneratedGuide,
  usePDFUpload,
} from "@/src/utils/query/aiGeneratedQuery";
import { useGetAllDesk } from "@/src/utils/query/deskQuery";
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import SkeletonCard from "@/src/components/loaders/SkeletonCard";
import { DeskType } from "@/src/types/desk.type";
import { GeneratedPDFType, PDFDocumentType, StudyGuideCardType, StudyMaterialType } from "@/src/types/studyGuide.type";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [fileName, setFileName] = useState("");
  const [filePath, setFilePath] = useState("");
  const {
    data: deskData,
    isLoading: deskLoading,
    refetch: deskRefetch,
  } = useGetAllDesk();

  const {
    data: aiGeneratedGuideData,
    isLoading: aiGeneratedGuideLoading,
    refetch: aiGeneratedGuideRefetch,
  } = useGetAIGeneratedGuide();

  const {
    data: aiGeneratedGuideDataFromPDF,
    isLoading: aiGeneratedGuideLoadingFromPDF,
    refetch: aiGeneratedGuideRefetchFromPDF,
  } = useGetPDFGeneratedGuide();

  const { mutate, isPending } = usePDFUpload();

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([deskRefetch(), aiGeneratedGuideRefetch(), aiGeneratedGuideRefetchFromPDF()]);
    setRefreshing(false);
  };

  const handlePickFile = async () => {
    try {
      const result: DocumentPicker.DocumentPickerResult =
        await DocumentPicker.getDocumentAsync({
          type: "application/pdf",
          copyToCacheDirectory: false,
          multiple: false,
        });

      if (result.canceled) {
        alert("File selection cancelled");
        return;
      }

      const pickedFile = result.assets[0];
      const newPath = `${FileSystem.cacheDirectory}${pickedFile.name}`;

      await FileSystem.copyAsync({
        from: pickedFile.uri,
        to: newPath,
      });

      setFileName(pickedFile.name);
      setFilePath(newPath);
    } catch (err) {
      console.log("Error picking file:", err);
    }
  };

  const handleGenerate = () => {
    if (!filePath && !fileName) {
      alert("Please select a file first");
      return;
    }

    const fileInfo = {
      fileName,
      filePath,
    };

    mutate(
      { fileInfo },
      {
        onSuccess: () => {
          alert("File uploaded successfully");
          setFileName("");
          setFilePath("");
        },
        onError: (error) => {
          setFileName("");
          setFilePath("");
          alert("Failed to upload file");
          console.error("Error uploading file:", error);
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 py-6">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#fff"
          />
        }
      >
        <View className="">
          <Text className="text-3xl text-white font-semibold px-4">Desk</Text>
          <FlatList<DeskType>
            data={deskLoading ? new Array(3).fill(null) : deskData}
            keyExtractor={(item, index) =>
              item?.id?.toString?.() || `skeleton-${index}`
            }
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-4 px-4 mt-2"
            renderItem={({ item }) =>
              deskLoading ? (
                <SkeletonCard />
              ) : (
                <Pressable
                  onPress={() => router.push(`/deskCard/${item.id}`)}
                  className="bg-[#212121] p-3 rounded-xl w-80"
                >
                  <Text className="text-xl font-medium text-white">
                    {item.subject_name}
                  </Text>
                  {item.description && (
                    <Text className="text-[#c2c2c2]">{item.description}</Text>
                  )}
                  <Text className="mt-4 text-white">
                    {dayjs(item.created_at).format("DD/MM/YYYY")}
                  </Text>
                </Pressable>
              )
            }
          />
        </View>

        <View className="mt-4">
          <Text className="text-3xl text-white font-semibold px-4">
            Study Guides - AI
          </Text>
          <FlatList<StudyGuideCardType>
            data={
              aiGeneratedGuideLoading
                ? new Array(3).fill(null)
                : aiGeneratedGuideData
            }
            keyExtractor={(item, index) =>
              item?.id?.toString?.() || `skeleton-${index}`
            }
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-4 px-4 mt-2"
            renderItem={({ item }) =>
              aiGeneratedGuideLoading ? (
                <SkeletonCard />
              ) : (
                <Pressable
                  onPress={() => router.push(`/studyGuide/${item.id}`)}
                  className="bg-[#212121] p-3 rounded-xl w-80"
                >
                  <Text className="text-xl font-medium text-white">
                    {item.subject_name}
                  </Text>
                  <Text className="mt-4 text-white">
                    {dayjs(item.created_at).format("DD/MM/YYYY")}
                  </Text>
                </Pressable>
              )
            }
          />
        </View>

        <View className="mt-4">
          <Text className="text-3xl text-white font-semibold px-4">
            Study Guides - PDF
          </Text>
          <FlatList<GeneratedPDFType>
            data={
              aiGeneratedGuideLoadingFromPDF
                ? new Array(3).fill(null)
                : aiGeneratedGuideDataFromPDF
            }
            keyExtractor={(item, index) =>
              item?.id?.toString?.() || `skeleton-${index}`
            }
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-4 px-4 mt-2"
            renderItem={({ item }) =>
              aiGeneratedGuideLoadingFromPDF ? (
                <SkeletonCard />
              ) : (
                <Pressable
                  onPress={() => router.push(`/studyGuideFromPdf/${item.id}`)}
                  className="bg-[#212121] p-3 rounded-xl w-80"
                >
                  <Text className="text-xl font-medium text-white">
                    {item.content.title}
                  </Text>
                  <Text className="mt-4 text-white">
                    {dayjs(item.created_at).format("DD/MM/YYYY")}
                  </Text>
                </Pressable>
              )
            }
          />
        </View>

        <TouchableOpacity onPress={handlePickFile}>
          <View pointerEvents="none">
            <TextInput
              className="bg-[#212121] p-3 rounded-xl w-80 mx-auto mt-4 text-white"
              placeholderTextColor="#c2c2c2"
              onChangeText={(text) => setFileName(text)}
              value={fileName}
              placeholder="Tap to select a file"
              editable={false}
            />
          </View>
        </TouchableOpacity>

        {fileName && (
          <View className="bg-[#212121] p-3 rounded-xl w-80 mx-auto mt-4">
            <Text className="text-xl font-medium text-white">{fileName}</Text>
          </View>
        )}

        <Pressable
          onPress={handleGenerate}
          className="bg-[#212121] p-3 rounded-xl w-80 mx-auto mt-4"
        >
          <Text className="text-xl font-medium text-white">
            {isPending ? "Generating..." : "Generate"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
