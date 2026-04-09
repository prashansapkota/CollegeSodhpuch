'use client';
import React from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';

export function SiteHeader() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);

	const links = [
		{ label: 'Home', href: '/' },
		{ label: 'Dashboard', href: '/dashboard' },
		{ label: 'About', href: '/#about' },
	];

	React.useEffect(() => {
		document.body.style.overflow = open ? 'hidden' : '';
		return () => { document.body.style.overflow = ''; };
	}, [open]);

	return (
		<header
			className={cn(
				'sticky top-0 z-50 mx-auto w-full max-w-5xl border-b border-transparent md:rounded-md md:border md:transition-all md:ease-out',
				{
					'bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg md:top-4 md:max-w-4xl md:shadow':
						scrolled && !open,
					'bg-background/90': open,
				},
			)}
		>
			<nav
				className={cn(
					'flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out',
					{ 'md:px-2': scrolled },
				)}
			>
				{/* Logo */}
				<Link href="/" className="text-sm font-bold tracking-tight text-foreground no-underline">
					CollegeSodhpuch
				</Link>

				{/* Desktop links */}
				<div className="hidden items-center gap-2 md:flex">
					{links.map((link) => (
						<Link key={link.label} className={buttonVariants({ variant: 'ghost' })} href={link.href}>
							{link.label}
						</Link>
					))}
					<Button variant="outline" asChild>
						<Link href="/login">Sign In</Link>
					</Button>
					<Button asChild>
						<Link href="/register">Get Started</Link>
					</Button>
				</div>

				{/* Mobile menu toggle */}
				<Button size="icon" variant="outline" onClick={() => setOpen(!open)} className="md:hidden">
					<MenuToggleIcon open={open} className="size-5" duration={300} />
				</Button>
			</nav>

			{/* Mobile drawer */}
			<div
				className={cn(
					'bg-background/90 fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y md:hidden',
					open ? 'block' : 'hidden',
				)}
			>
				<div
					data-slot={open ? 'open' : 'closed'}
					className={cn(
						'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
						'flex h-full w-full flex-col justify-between gap-y-2 p-4',
					)}
				>
					<div className="grid gap-y-2">
						{links.map((link) => (
							<Link
								key={link.label}
								className={buttonVariants({ variant: 'ghost', className: 'justify-start' })}
								href={link.href}
								onClick={() => setOpen(false)}
							>
								{link.label}
							</Link>
						))}
					</div>
					<div className="flex flex-col gap-2">
						<Button variant="outline" className="w-full" asChild>
							<Link href="/login" onClick={() => setOpen(false)}>Sign In</Link>
						</Button>
						<Button className="w-full" asChild>
							<Link href="/register" onClick={() => setOpen(false)}>Get Started</Link>
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
