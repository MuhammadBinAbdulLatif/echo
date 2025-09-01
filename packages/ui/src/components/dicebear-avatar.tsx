'use client'
import { glass } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { Avatar, AvatarImage } from "@workspace/ui/components/avatar";
import { cn } from "@workspace/ui/lib/utils";

import { useMemo } from "react";

interface DicebearAvatarProps {
    seed: string;
    className?: string;
    size: number;
    badgeClassName?: string;
    imageUrl?: string;
    badgeImageUrl?: string;
}

export const DiceBearAvatar  = ({seed, className, size, badgeClassName, imageUrl, badgeImageUrl}: DicebearAvatarProps) => {
    const avatarSrc = useMemo(()=> {
        if(imageUrl){
            return imageUrl;

        }
        const avatar = createAvatar(glass, {
            seed: seed.toLocaleLowerCase().trim(),
            size
        })
        return avatar.toDataUri()
    }, [seed, size])
    const badgeSize = Math.round(size * 0.5);
    return (
        <div className="relative inline-block" style={{width: size, height: size}}>
            <Avatar className={cn('border', className)} style={{width: size, height: size}}>
                <AvatarImage alt="image" src={avatarSrc} />
            </Avatar>
            {badgeImageUrl && (
                <div className={cn('absolute right-0 bottom-0 flex items-center justify-center overflow-hidden rounded-full border-2 border-background bg-background', badgeClassName)} style={{width: badgeSize, height: badgeSize, transform: 'translate(50%, 50%)'}}>
                    <img alt="badge" src={badgeImageUrl} className="h-full w-full object-cover"  height={badgeSize} width={badgeSize}/>
                </div>
            )}
        </div>
        
    )

}