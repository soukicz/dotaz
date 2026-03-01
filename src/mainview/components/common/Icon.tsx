import type { JSX } from "solid-js";
import {
	Database,
	Table,
	Eye,
	Layers,
	Grid3x3,
	SquareTerminal,
	Play,
	Square,
	RefreshCw,
	Plus,
	X,
	Settings,
	Filter,
	Columns3,
	Download,
	Search,
	Copy,
	Pencil,
	Trash2,
	ChevronLeft,
	ChevronRight,
	ChevronDown,
	ArrowUp,
	ArrowDown,
	Key,
	Link,
	History,
	Save,
	PanelLeft,
	Command,
	Pin,
	EyeOff,
	Check,
	TriangleAlert,
	CircleAlert,
	Info,
} from "lucide-solid";
import type { LucideProps } from "lucide-solid";

export type IconName =
	| "database"
	| "table"
	| "view"
	| "schema"
	| "grid"
	| "sql-console"
	| "play"
	| "stop"
	| "refresh"
	| "plus"
	| "close"
	| "settings"
	| "filter"
	| "columns"
	| "export"
	| "search"
	| "copy"
	| "edit"
	| "delete"
	| "arrow-left"
	| "arrow-right"
	| "chevron-left"
	| "chevron-right"
	| "chevron-down"
	| "sort-asc"
	| "sort-desc"
	| "key"
	| "link"
	| "history"
	| "save"
	| "sidebar"
	| "command"
	| "pin"
	| "eye"
	| "eye-off"
	| "check"
	| "warning"
	| "error"
	| "info"
	| "spinner";

interface IconProps {
	name: IconName;
	size?: number;
	class?: string;
	style?: JSX.CSSProperties;
	title?: string;
}

type LucideComponent = (props: LucideProps) => JSX.Element;

const ICON_MAP: Record<Exclude<IconName, "spinner">, LucideComponent> = {
	database: Database,
	table: Table,
	view: Eye,
	schema: Layers,
	grid: Grid3x3,
	"sql-console": SquareTerminal,
	play: Play,
	stop: Square,
	refresh: RefreshCw,
	plus: Plus,
	close: X,
	settings: Settings,
	filter: Filter,
	columns: Columns3,
	export: Download,
	search: Search,
	copy: Copy,
	edit: Pencil,
	delete: Trash2,
	"arrow-left": ChevronLeft,
	"arrow-right": ChevronRight,
	"chevron-left": ChevronLeft,
	"chevron-right": ChevronRight,
	"chevron-down": ChevronDown,
	"sort-asc": ArrowUp,
	"sort-desc": ArrowDown,
	key: Key,
	link: Link,
	history: History,
	save: Save,
	sidebar: PanelLeft,
	command: Command,
	pin: Pin,
	eye: Eye,
	"eye-off": EyeOff,
	check: Check,
	warning: TriangleAlert,
	error: CircleAlert,
	info: Info,
};

export default function Icon(props: IconProps) {
	const size = () => props.size ?? 16;

	if (props.name === "spinner") {
		return (
			<span
				class={`spinner${props.class ? ` ${props.class}` : ""}`}
				style={{
					width: `${size()}px`,
					height: `${size()}px`,
					...(props.style ?? {}),
				}}
				title={props.title}
			/>
		);
	}

	const Component = ICON_MAP[props.name];

	return (
		<Component
			size={size()}
			class={props.class}
			style={props.style}
			aria-hidden={!props.title}
			role={props.title ? "img" : undefined}
		/>
	);
}
